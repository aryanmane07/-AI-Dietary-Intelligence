const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

require("dotenv").config({
  path: __dirname + "/.env",
});

const { GoogleGenAI } = require("@google/genai");

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const app = express();

const PORT =
  process.env.PORT || 5001;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

const IS_PRODUCTION =
  process.env.NODE_ENV === "production";

const SESSION_COOKIE_NAME =
  "dietary_session";

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ==================================================
// EMAIL / PASSWORD RESET SETUP
// ==================================================

let emailTransporter = null;

if (
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASSWORD
) {
  emailTransporter =
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port:
        Number(process.env.SMTP_PORT) || 587,
      secure:
        Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

  console.log(
    "Password reset email service configured."
  );
} else {
  console.log(
    "SMTP email settings not configured yet."
  );
}

// ==================================================
// FILE UPLOAD SETUP
// ==================================================

const uploadsDirectory = path.join(
  __dirname,
  "uploads"
);

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, {
    recursive: true,
  });
}

const storage =
  multer.diskStorage({
    destination: function (
      req,
      file,
      cb
    ) {
      cb(null, uploadsDirectory);
    },

    filename: function (
      req,
      file,
      cb
    ) {
      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9);

      cb(
        null,
        uniqueName +
          path.extname(file.originalname)
      );
    },
  });

const upload = multer({
  storage,
});

// ==================================================
// MONGODB CONNECTION
// ==================================================

const client = new MongoClient(
  process.env.MONGODB_URI
);

async function connectToDatabase() {
  try {
    await client.connect();

    await client
      .db("admin")
      .command({
        ping: 1,
      });

    console.log(
      "MongoDB connected successfully!"
    );

    const database = getDatabase();

    await database
      .collection("sessions")
      .createIndex(
        {
          expiresAt: 1,
        },
        {
          expireAfterSeconds: 0,
        }
      );

    await database
      .collection("users")
      .createIndex(
        {
          email: 1,
        },
        {
          unique: true,
        }
      );

    await database
      .collection("mealPlans")
      .createIndex({
        userId: 1,
        updatedAt: -1,
      });

    await database
      .collection("mealPlans")
      .createIndex({
        userId: 1,
        createdAt: -1,
      });

    console.log(
      "Authentication and meal-plan indexes ready."
    );
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error
    );
  }
}

// ==================================================
// GET DATABASE
// ==================================================

function getDatabase() {
  return client.db("dietaryAI");
}

// ==================================================
// AUTHENTICATION HELPERS
// ==================================================

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

function normalizeUserId(userId) {
  return String(userId || "").trim();
}

// ==================================================
// SESSION HELPERS
// ==================================================

function hashSessionToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function createSessionToken() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

function getSessionCookieOptions(
  rememberMe
) {
  const options = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION
      ? "none"
      : "lax",
    path: "/",
  };

  if (rememberMe) {
    options.maxAge =
      30 *
      24 *
      60 *
      60 *
      1000;
  }

  return options;
}

function getClearCookieOptions() {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION
      ? "none"
      : "lax",
    path: "/",
  };
}

function parseCookies(cookieHeader) {
  const cookies = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader
    .split(";")
    .forEach((cookie) => {
      const separator =
        cookie.indexOf("=");

      if (separator === -1) {
        return;
      }

      const key = cookie
        .slice(0, separator)
        .trim();

      const value = cookie
        .slice(separator + 1)
        .trim();

      if (key) {
        cookies[key] =
          decodeURIComponent(value);
      }
    });

  return cookies;
}

// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

async function requireAuth(
  req,
  res,
  next
) {
  try {
    const cookies =
      parseCookies(
        req.headers.cookie
      );

    const sessionToken =
      cookies[
        SESSION_COOKIE_NAME
      ];

    if (!sessionToken) {
      return res.status(401).json({
        message:
          "Authentication required. Please log in again.",
      });
    }

    const sessionTokenHash =
      hashSessionToken(
        sessionToken
      );

    const sessions =
      getDatabase().collection(
        "sessions"
      );

    const session =
      await sessions.findOne({
        tokenHash:
          sessionTokenHash,

        expiresAt: {
          $gt: new Date(),
        },
      });

    if (!session) {
      res.clearCookie(
        SESSION_COOKIE_NAME,
        getClearCookieOptions()
      );

      return res.status(401).json({
        message:
          "Your session has expired. Please log in again.",
      });
    }

    req.authUserId =
      normalizeUserId(
        session.userId
      );

    req.authSessionId =
      session._id;

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error
    );

    res.status(500).json({
      message:
        "Could not verify your session.",
    });
  }
}

// ==================================================
// PASSWORD RESET HELPERS
// ==================================================

function hashResetToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

// ==================================================
// PERSONALIZATION DATA
// ==================================================

async function getPersonalizationData(
  userId
) {
  const database =
    getDatabase();

  const digitalTwins =
    database.collection(
      "digitalTwins"
    );

  const foodGenomes =
    database.collection(
      "foodGenomes"
    );

  const cleanUserId =
    normalizeUserId(userId);

  if (!cleanUserId) {
    return {
      digitalTwin: null,
      foodGenome: null,
    };
  }

  const [
    digitalTwin,
    foodGenome,
  ] = await Promise.all([
    digitalTwins.findOne({
      userId: cleanUserId,
    }),

    foodGenomes.findOne({
      userId: cleanUserId,
    }),
  ]);

  return {
    digitalTwin,
    foodGenome,
  };
}

// ==================================================
// GET AUTHENTICATED PATIENT
// ==================================================

async function getAuthenticatedPatient(
  userId
) {
  const cleanUserId =
    normalizeUserId(userId);

  if (!cleanUserId) {
    return null;
  }

  const database =
    getDatabase();

  const patients =
    database.collection(
      "patients"
    );

  return await patients.findOne({
    userId: cleanUserId,
  });
}

// ==================================================
// GET PREVIOUS MEAL PLANS
// ==================================================

async function getPreviousMealPlans(
  userId,
  excludeMealPlanId = null
) {
  const database =
    getDatabase();

  const mealPlans =
    database.collection(
      "mealPlans"
    );

  const cleanUserId =
    normalizeUserId(userId);

  const query = {
    userId: cleanUserId,
  };

  if (
    excludeMealPlanId &&
    ObjectId.isValid(
      excludeMealPlanId
    )
  ) {
    query._id = {
      $ne: new ObjectId(
        excludeMealPlanId
      ),
    };
  }

  return await mealPlans
    .find(query, {
      projection: {
        mealPlan: 1,
        goal: 1,
        context: 1,
        customization: 1,
        createdAt: 1,
        updatedAt: 1,
        latestFeedback: 1,
      },
    })
    .sort({
      updatedAt: -1,
    })
    .limit(8)
    .toArray();
}

// ==================================================
// BUILD FOOD GENOME LEARNING SUMMARY
// ==================================================

function buildFoodGenomeLearning(
  foodGenome
) {
  if (!foodGenome) {
    return {
      preferences: [],
      reactions: [],
      recentExperiences: [],
      learnedPatterns: [],
      mealPlanFeedback: [],
    };
  }

  const preferences = [];

  const preferenceGroups = [
    {
      label: "loved",
      items:
        Array.isArray(
          foodGenome.lovedFoods
        )
          ? foodGenome.lovedFoods
          : [],
    },

    {
      label: "liked",
      items:
        Array.isArray(
          foodGenome.likedFoods
        )
          ? foodGenome.likedFoods
          : [],
    },

    {
      label: "neutral",
      items:
        Array.isArray(
          foodGenome.neutralFoods
        )
          ? foodGenome.neutralFoods
          : [],
    },

    {
      label: "disliked",
      items:
        Array.isArray(
          foodGenome.dislikedFoods
        )
          ? foodGenome.dislikedFoods
          : [],
    },
  ];

  preferenceGroups.forEach(
    (group) => {
      group.items.forEach(
        (item) => {
          if (item?.foodName) {
            preferences.push({
              foodName:
                item.foodName,

              preference:
                group.label,

              reaction:
                item.reaction ||
                "",

              notes:
                item.notes ||
                "",
            });
          }
        }
      );
    }
  );

  const reactions =
    Array.isArray(
      foodGenome.reactions
    )
      ? foodGenome.reactions
      : [];

  const foods =
    Array.isArray(
      foodGenome.foods
    )
      ? foodGenome.foods
      : [];

  const reactionGroups =
    new Map();

  reactions.forEach(
    (item) => {
      if (!item?.foodName) {
        return;
      }

      const key =
        item.foodName
          .trim()
          .toLowerCase();

      if (
        !reactionGroups.has(
          key
        )
      ) {
        reactionGroups.set(
          key,
          {
            foodName:
              item.foodName,

            reactions: [],
          }
        );
      }

      if (item.reaction) {
        reactionGroups
          .get(key)
          .reactions.push(
            item.reaction
          );
      }
    }
  );

  const learnedPatterns = [];

  reactionGroups.forEach(
    (group) => {
      const preferenceMatch =
        preferences.find(
          (item) =>
            item.foodName
              .trim()
              .toLowerCase() ===
            group.foodName
              .trim()
              .toLowerCase()
        );

      learnedPatterns.push({
        foodName:
          group.foodName,

        preference:
          preferenceMatch?.preference ||
          "not recorded",

        reactionCount:
          group.reactions.length,

        reactions:
          group.reactions,

        learningStrength:
          group.reactions.length >=
          3
            ? "strong repeated pattern"
            : group.reactions.length ===
              2
            ? "emerging repeated pattern"
            : "single recorded experience",
      });
    }
  );

  const mealPlanFeedback =
    Array.isArray(
      foodGenome.mealPlanFeedback
    )
      ? foodGenome.mealPlanFeedback
      : [];

  return {
    preferences,

    reactions,

    recentExperiences:
      foods
        .slice()
        .reverse()
        .slice(0, 10),

    learnedPatterns,

    mealPlanFeedback:
      mealPlanFeedback
        .slice()
        .reverse()
        .slice(0, 10),
  };
}

// ==================================================
// GEMINI ERROR HELPER
// ==================================================

function getGeminiErrorMessage(
  error
) {
  const errorText =
    String(
      error?.message ||
        error ||
        ""
    );

  if (
    errorText.includes(
      "RESOURCE_EXHAUSTED"
    ) ||
    errorText.includes(
      "GenerateRequestsPerDay"
    ) ||
    errorText.includes(
      "quota"
    ) ||
    errorText.includes("429")
  ) {
    return (
      "The AI daily free-tier limit has been reached. Please try again after the quota resets."
    );
  }

  return null;
}

// ==================================================
// TEST ROUTE
// ==================================================

app.get("/", (req, res) => {
  res.json({
    message:
      "AI Dietary Intelligence Backend is running!",
  });
});

// ==================================================
// SIGNUP
// ==================================================

app.post(
  "/signup",
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      const email =
        normalizeEmail(
          req.body.email
        );

      const password =
        String(
          req.body.password || ""
        );

      if (!email) {
        return res.status(400).json({
          message:
            "Email address is required.",
        });
      }

      if (
        !isValidEmail(email)
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid email address.",
        });
      }

      if (!password) {
        return res.status(400).json({
          message:
            "Password is required.",
        });
      }

      if (
        password.length < 8
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters.",
        });
      }

      const existingUser =
        await users.findOne({
          email,
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "An account with this email already exists. Please log in.",
        });
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      const now =
        new Date();

      const user = {
        email,
        passwordHash,
        createdAt: now,
        updatedAt: now,
      };

      const result =
        await users.insertOne(
          user
        );

      res.status(201).json({
        message:
          "Account created successfully.",

        userId:
          result.insertedId.toString(),

        email,
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      if (
        error?.code ===
        11000
      ) {
        return res.status(409).json({
          message:
            "An account with this email already exists. Please log in.",
        });
      }

      res.status(500).json({
        message:
          "Could not create your account.",
      });
    }
  }
);

// ==================================================
// LOGIN
// ==================================================

app.post(
  "/login",
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      const sessions =
        database.collection(
          "sessions"
        );

      const email =
        normalizeEmail(
          req.body.email
        );

      const password =
        String(
          req.body.password || ""
        );

      const rememberMe =
        Boolean(
          req.body.rememberMe
        );

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email and password are required.",
        });
      }

      const user =
        await users.findOne({
          email,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (!passwordMatches) {
        return res.status(401).json({
          message:
            "Invalid email or password.",
        });
      }

      const sessionToken =
        createSessionToken();

      const sessionTokenHash =
        hashSessionToken(
          sessionToken
        );

      const now =
        new Date();

      const sessionLifetime =
        rememberMe
          ? 30 *
            24 *
            60 *
            60 *
            1000
          : 24 *
            60 *
            60 *
            1000;

      const expiresAt =
        new Date(
          Date.now() +
            sessionLifetime
        );

      await sessions.insertOne({
        userId:
          user._id.toString(),

        tokenHash:
          sessionTokenHash,

        rememberMe,

        createdAt:
          now,

        expiresAt,
      });

      await users.updateOne(
        {
          _id:
            user._id,
        },
        {
          $set: {
            lastLoginAt:
              now,

            updatedAt:
              now,
          },
        }
      );

      res.cookie(
        SESSION_COOKIE_NAME,
        sessionToken,
        getSessionCookieOptions(
          rememberMe
        )
      );

      res.json({
        message:
          "Login successful.",

        userId:
          user._id.toString(),

        email:
          user.email,

        rememberMe,
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      res.status(500).json({
        message:
          "Could not log you in.",
      });
    }
  }
);

// ==================================================
// GET CURRENT AUTHENTICATED USER
// ==================================================

app.get(
  "/me",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      if (
        !ObjectId.isValid(
          req.authUserId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid authenticated user ID.",
        });
      }

      const user =
        await users.findOne(
          {
            _id:
              new ObjectId(
                req.authUserId
              ),
          },
          {
            projection: {
              passwordHash: 0,
              resetTokenHash: 0,
              resetTokenExpiresAt: 0,
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User account not found.",
        });
      }

      res.json({
        userId:
          user._id.toString(),

        email:
          user.email,

        createdAt:
          user.createdAt,

        lastLoginAt:
          user.lastLoginAt ||
          null,
      });
    } catch (error) {
      console.error(
        "Current user retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve your account.",
      });
    }
  }
);

// ==================================================
// LOGOUT
// ==================================================

app.post(
  "/logout",
  async (req, res) => {
    try {
      const cookies =
        parseCookies(
          req.headers.cookie
        );

      const sessionToken =
        cookies[
          SESSION_COOKIE_NAME
        ];

      if (sessionToken) {
        const sessionTokenHash =
          hashSessionToken(
            sessionToken
          );

        await getDatabase()
          .collection(
            "sessions"
          )
          .deleteOne({
            tokenHash:
              sessionTokenHash,
          });
      }

      res.clearCookie(
        SESSION_COOKIE_NAME,
        getClearCookieOptions()
      );

      res.json({
        message:
          "Logged out successfully.",
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      res.status(500).json({
        message:
          "Could not log you out.",
      });
    }
  }
);

// ==================================================
// FORGOT PASSWORD
// ==================================================

app.post(
  "/forgot-password",
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      const email =
        normalizeEmail(
          req.body.email
        );

      if (
        !email ||
        !isValidEmail(email)
      ) {
        return res.status(400).json({
          message:
            "Please enter a valid email address.",
        });
      }

      const genericMessage =
        "If an account exists for this email, a password reset link has been sent.";

      const user =
        await users.findOne({
          email,
        });

      if (!user) {
        return res.json({
          message:
            genericMessage,
        });
      }

      if (!emailTransporter) {
        console.error(
          "Password reset requested, but SMTP is not configured."
        );

        return res.status(500).json({
          message:
            "Email service is not configured yet.",
        });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      const resetTokenHash =
        hashResetToken(
          resetToken
        );

      const resetTokenExpiresAt =
        new Date(
          Date.now() +
            30 *
              60 *
              1000
        );

      await users.updateOne(
        {
          _id:
            user._id,
        },
        {
          $set: {
            resetTokenHash,

            resetTokenExpiresAt,

            updatedAt:
              new Date(),
          },
        }
      );

      const resetUrl =
        `${CLIENT_URL}/reset-password?token=${encodeURIComponent(
          resetToken
        )}`;

      await emailTransporter.sendMail({
        from:
          process.env.SMTP_FROM ||
          process.env.SMTP_USER,

        to: email,

        subject:
          "Reset Your Dietary Intelligence Password",

        text:
          `You requested a password reset for your Dietary Intelligence account.\n\n` +
          `Use the following link to create a new password:\n\n` +
          `${resetUrl}\n\n` +
          `This link expires in 30 minutes and can only be used once.\n\n` +
          `If you did not request this password reset, you can safely ignore this email.`,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
            <h2>Reset Your Password</h2>
            <p>
              You requested a password reset for your
              Dietary Intelligence account.
            </p>
            <p>
              Click the button below to create a new password.
            </p>
            <p>
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background: #111827;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                "
              >
                Reset Password
              </a>
            </p>
            <p>
              This link expires in
              <strong>30 minutes</strong>
              and can only be used once.
            </p>
            <p>
              If you did not request this password reset,
              you can safely ignore this email.
            </p>
          </div>
        `,
      });

      console.log(
        `Password reset email sent to ${email}`
      );

      res.json({
        message:
          genericMessage,
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      res.status(500).json({
        message:
          "Could not process the password reset request.",
      });
    }
  }
);

// ==================================================
// RESET PASSWORD
// ==================================================

app.post(
  "/reset-password",
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      const token =
        String(
          req.body.token || ""
        ).trim();

      const newPassword =
        String(
          req.body.password || ""
        );

      if (!token) {
        return res.status(400).json({
          message:
            "Password reset token is missing.",
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          message:
            "New password is required.",
        });
      }

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters.",
        });
      }

      const resetTokenHash =
        hashResetToken(token);

      const user =
        await users.findOne({
          resetTokenHash,

          resetTokenExpiresAt: {
            $gt: new Date(),
          },
        });

      if (!user) {
        return res.status(400).json({
          message:
            "This password reset link is invalid or has expired.",
        });
      }

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          12
        );

      const result =
        await users.updateOne(
          {
            _id:
              user._id,

            resetTokenHash,

            resetTokenExpiresAt: {
              $gt: new Date(),
            },
          },
          {
            $set: {
              passwordHash,

              updatedAt:
                new Date(),
            },

            $unset: {
              resetTokenHash:
                "",

              resetTokenExpiresAt:
                "",
            },
          }
        );

      if (
        result.modifiedCount !== 1
      ) {
        return res.status(400).json({
          message:
            "This password reset link is invalid or has already been used.",
        });
      }

      await getDatabase()
        .collection("sessions")
        .deleteMany({
          userId:
            user._id.toString(),
        });

      res.json({
        message:
          "Password reset successfully. You can now log in with your new password.",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      res.status(500).json({
        message:
          "Could not reset your password.",
      });
    }
  }
);

// ==================================================
// LEGACY USER ROUTE
// ==================================================

app.get(
  "/user/:userId",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const users =
        database.collection(
          "users"
        );

      const requestedUserId =
        normalizeUserId(
          req.params.userId
        );

      if (
        requestedUserId !==
        req.authUserId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this account.",
        });
      }

      if (
        !ObjectId.isValid(
          requestedUserId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid user ID.",
        });
      }

      const user =
        await users.findOne(
          {
            _id:
              new ObjectId(
                requestedUserId
              ),
          },
          {
            projection: {
              passwordHash: 0,
              resetTokenHash: 0,
              resetTokenExpiresAt: 0,
            },
          }
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User account not found.",
        });
      }

      res.json({
        userId:
          user._id.toString(),

        email:
          user.email,

        createdAt:
          user.createdAt,

        lastLoginAt:
          user.lastLoginAt ||
          null,
      });
    } catch (error) {
      console.error(
        "User retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve user account.",
      });
    }
  }
);

// ==================================================
// NUTRITION
// ==================================================

app.get(
  "/nutrition",
  async (req, res) => {
    try {
      const food =
        req.query.food ||
        "masala dosa";

      const response =
        await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(
            food
          )}&pageSize=5`
        );

      if (!response.ok) {
        return res
          .status(response.status)
          .json({
            message:
              "USDA API request failed.",
          });
      }

      const data =
        await response.json();

      if (
        !data.foods ||
        data.foods.length === 0
      ) {
        return res.status(404).json({
          message:
            "No USDA nutrition data found for this food.",
        });
      }

      const result =
        data.foods[0];

      const getNutrient =
        (name) => {
          const nutrient =
            result.foodNutrients?.find(
              (item) =>
                item.nutrientName
                  ?.toLowerCase() ===
                name.toLowerCase()
            );

          return (
            nutrient?.value ?? null
          );
        };

      res.json({
        foodName:
          result.description,

        fdcId:
          result.fdcId,

        calories:
          getNutrient("Energy"),

        protein:
          getNutrient("Protein"),

        carbohydrates:
          getNutrient(
            "Carbohydrate, by difference"
          ),

        fat:
          getNutrient(
            "Total lipid (fat)"
          ),

        fiber:
          getNutrient(
            "Fiber, total dietary"
          ),
      });
    } catch (error) {
      console.error(
        "USDA nutrition error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve nutrition data.",
      });
    }
  }
);

// ==================================================
// FOOD RECOGNITION
// ==================================================

app.post(
  "/recognize-food",
  requireAuth,
  upload.single("foodImage"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "No food image uploaded.",
        });
      }

      const pythonPath =
        path.join(
          __dirname,
          "food-ai",
          "bin",
          "python3"
        );

      const scriptPath =
        path.join(
          __dirname,
          "food_recognition.py"
        );

      execFile(
        pythonPath,
        [
          scriptPath,
          req.file.path,
        ],
        (
          error,
          stdout,
          stderr
        ) => {
          if (error) {
            console.error(
              "Food recognition error:",
              error
            );

            console.error(
              "Python output:",
              stderr
            );

            return res.status(500).json({
              message:
                "Food recognition failed.",
            });
          }

          try {
            const result =
              JSON.parse(
                stdout.trim()
              );

            res.json({
              foodName:
                result.foodName,

              score:
                result.score,
            });
          } catch (
            parseError
          ) {
            console.error(
              "Could not parse AI result:",
              stdout
            );

            res.status(500).json({
              message:
                "Could not read food recognition result.",
            });
          }
        }
      );
    } catch (error) {
      console.error(
        "Recognition route error:",
        error
      );

      res.status(500).json({
        message:
          "Could not process food image.",
      });
    }
  }
);

// ==================================================
// PATIENT PROFILE
// ==================================================

app.post(
  "/patients",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const patients =
        database.collection(
          "patients"
        );

      const digitalTwins =
        database.collection(
          "digitalTwins"
        );

      const foodGenomes =
        database.collection(
          "foodGenomes"
        );

      const patient =
        req.body;

      const userId =
        req.authUserId;

      if (!userId) {
        return res.status(401).json({
          message:
            "Authentication required.",
        });
      }

      if (
        !patient?.name ||
        !patient.name.trim()
      ) {
        return res.status(400).json({
          message:
            "Patient name is required.",
        });
      }

      const cleanName =
        patient.name.trim();

      const now =
        new Date();

      const patientData = {
        userId,

        name:
          cleanName,

        age:
          patient.age || "",

        gender:
          patient.gender || "",

        height:
          patient.height || "",

        weight:
          patient.weight || "",

        bloodPressure:
          patient.bloodPressure || "",

        bloodSugar:
          patient.bloodSugar || "",

        diseases:
          patient.diseases || "",

        allergies:
          patient.allergies || "",

        foodPreferences:
          patient.foodPreferences || "",

        updatedAt:
          now,
      };

      const existingPatient =
        await patients.findOne({
          userId,
        });

      let patientId;

      if (existingPatient) {
        await patients.updateOne(
          {
            _id:
              existingPatient._id,
          },
          {
            $set: {
              ...patientData,

              createdAt:
                existingPatient.createdAt ||
                now,
            },
          }
        );

        patientId =
          existingPatient._id;
      } else {
        const result =
          await patients.insertOne({
            ...patientData,

            createdAt:
              now,
          });

        patientId =
          result.insertedId;
      }

      await digitalTwins.updateOne(
        {
          userId,
        },
        {
          $setOnInsert: {
            userId,

            createdAt:
              now,
          },

          $set: {
            patientName:
              cleanName,

            healthProfile:
              patientData,

            updatedAt:
              now,
          },
        },
        {
          upsert:
            true,
        }
      );

      await foodGenomes.updateOne(
        {
          userId,
        },
        {
          $setOnInsert: {
            userId,

            createdAt:
              now,
          },

          $set: {
            patientName:
              cleanName,

            updatedAt:
              now,
          },
        },
        {
          upsert:
            true,
          }
      );

      res.json({
        message:
          "Patient profile saved successfully.",

        patientId:
          patientId.toString(),

        userId,

        patient:
          patientData,
      });
    } catch (error) {
      console.error(
        "Error saving patient:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save patient profile.",
      });
    }
  }
);

// ==================================================
// GET PATIENT BY USER ID
// ==================================================

app.get(
  "/patients/user/:userId",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const patients =
        database.collection(
          "patients"
        );

      if (
        normalizeUserId(
          req.params.userId
        ) !==
        req.authUserId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this health profile.",
        });
      }

      const patient =
        await patients.findOne({
          userId:
            req.authUserId,
        });

      if (!patient) {
        return res.status(404).json({
          message:
            "No health profile found for this account.",
        });
      }

      res.json({
        userId:
          patient.userId,

        patientId:
          patient._id.toString(),

        name:
          patient.name,

        age:
          patient.age,

        gender:
          patient.gender || "",

        height:
          patient.height,

        weight:
          patient.weight,

        bloodPressure:
          patient.bloodPressure,

        bloodSugar:
          patient.bloodSugar,

        diseases:
          patient.diseases,

        allergies:
          patient.allergies || "",

        foodPreferences:
          patient.foodPreferences || "",

        createdAt:
          patient.createdAt,

        updatedAt:
          patient.updatedAt,
      });
    } catch (error) {
      console.error(
        "Patient profile retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve patient profile.",
      });
    }
  }
);

// ==================================================
// MEDICAL REPORT UPLOAD + GEMINI AI READING
// ==================================================

app.post(
  "/medical-reports",
  requireAuth,
  upload.single("medicalReport"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "No medical report uploaded.",
        });
      }

      const database =
        getDatabase();

      const reports =
        database.collection(
          "medicalReports"
        );

      const patients =
        database.collection(
          "patients"
        );

      const digitalTwins =
        database.collection(
          "digitalTwins"
        );

      const userId =
        req.authUserId;

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (
        !allowedTypes.includes(
          req.file.mimetype
        )
      ) {
        return res.status(400).json({
          message:
            "Only PDF, JPG, JPEG, and PNG medical reports are supported.",
        });
      }

      console.log(
        "Reading medical report with Gemini..."
      );

      const reportBytes =
        fs.readFileSync(
          req.file.path
        );

      const reportBase64 =
        reportBytes.toString(
          "base64"
        );

      const extractionPrompt = `
You are a medical document information extraction assistant.

Analyze the uploaded medical report.

Extract ONLY information that is explicitly visible,
written, or clearly stated in the document.

DO NOT:
- diagnose the patient
- infer diseases
- invent values
- estimate missing values
- make medical conclusions
- create information that is not in the document

Return ONLY valid JSON.

Use exactly this structure:

{
  "conditions": [],
  "bloodPressure": null,
  "bloodSugar": null,
  "fastingBloodSugar": null,
  "postMealBloodSugar": null,
  "hba1c": null,
  "cholesterol": null,
  "ldl": null,
  "hdl": null,
  "triglycerides": null,
  "hemoglobin": null,
  "thyroidResults": [],
  "kidneyFindings": [],
  "liverFindings": [],
  "allergies": [],
  "dietaryRestrictions": [],
  "medications": [],
  "otherRelevantFindings": []
}

Rules:

1. "conditions" should contain explicitly diagnosed or
   explicitly mentioned health conditions.

2. Blood values should contain the value and unit if
   available.

3. "thyroidResults" should contain objects such as:
   {
     "test": "TSH",
     "value": "..."
   }

4. "kidneyFindings" should contain explicitly reported
   kidney-related findings.

5. "liverFindings" should contain explicitly reported
   liver-related findings.

6. "allergies" should contain only allergies explicitly
   mentioned.

7. "dietaryRestrictions" should contain only dietary
   restrictions explicitly mentioned.

8. "medications" should contain medications only when
   clearly listed in the report.

9. "otherRelevantFindings" should contain other explicitly
   reported findings that could be relevant to dietary
   planning.

10. If a value is not present, use null.

11. If a list has no information, use [].

This is document extraction only, not medical diagnosis.
`;

      const aiResponse =
        await gemini.models.generateContent({
          model:
            "gemini-3.5-flash",

          contents: [
            {
              inlineData: {
                mimeType:
                  req.file.mimetype,

                data:
                  reportBase64,
              },
            },

            {
              text:
                extractionPrompt,
            },
          ],
        });

      const aiText =
        aiResponse.text || "";

      let cleanedJson =
        aiText.trim();

      if (
        cleanedJson.startsWith(
          "```"
        )
      ) {
        cleanedJson =
          cleanedJson
            .replace(
              /^```(?:json)?/i,
              ""
            )
            .replace(
              /```$/,
              ""
            )
            .trim();
      }

      let extractedData;

      try {
        extractedData =
          JSON.parse(
            cleanedJson
          );
      } catch (parseError) {
        console.error(
          "Gemini returned invalid JSON:",
          aiText
        );

        return res.status(500).json({
          message:
            "The report was uploaded, but the AI could not structure its information.",
        });
      }

      extractedData = {
        conditions:
          Array.isArray(
            extractedData.conditions
          )
            ? extractedData.conditions
            : [],

        bloodPressure:
          extractedData.bloodPressure ??
          null,

        bloodSugar:
          extractedData.bloodSugar ??
          null,

        fastingBloodSugar:
          extractedData.fastingBloodSugar ??
          null,

        postMealBloodSugar:
          extractedData.postMealBloodSugar ??
          null,

        hba1c:
          extractedData.hba1c ??
          null,

        cholesterol:
          extractedData.cholesterol ??
          null,

        ldl:
          extractedData.ldl ??
          null,

        hdl:
          extractedData.hdl ??
          null,

        triglycerides:
          extractedData.triglycerides ??
          null,

        hemoglobin:
          extractedData.hemoglobin ??
          null,

        thyroidResults:
          Array.isArray(
            extractedData.thyroidResults
          )
            ? extractedData.thyroidResults
            : [],

        kidneyFindings:
          Array.isArray(
            extractedData.kidneyFindings
          )
            ? extractedData.kidneyFindings
            : [],

        liverFindings:
          Array.isArray(
            extractedData.liverFindings
          )
            ? extractedData.liverFindings
            : [],

        allergies:
          Array.isArray(
            extractedData.allergies
          )
            ? extractedData.allergies
            : [],

        dietaryRestrictions:
          Array.isArray(
            extractedData.dietaryRestrictions
          )
            ? extractedData.dietaryRestrictions
            : [],

        medications:
          Array.isArray(
            extractedData.medications
          )
            ? extractedData.medications
            : [],

        otherRelevantFindings:
          Array.isArray(
            extractedData.otherRelevantFindings
          )
            ? extractedData.otherRelevantFindings
            : [],
      };

      const patient =
        await patients.findOne({
          userId,
        });

      const patientName =
        patient?.name || "";

      const now =
        new Date();

      const report = {
        userId,

        patientName,

        originalName:
          req.file.originalname,

        fileName:
          req.file.filename,

        filePath:
          req.file.path,

        fileType:
          req.file.mimetype,

        uploadedAt:
          now,

        aiAnalyzed:
          true,

        aiAnalyzedAt:
          now,

        extractedData,
      };

      const result =
        await reports.insertOne(
          report
        );

      await patients.updateOne(
        {
          userId,
        },
        {
          $set: {
            medicalReportId:
              result.insertedId.toString(),

            medicalReportAnalyzed:
              true,

            medicalReportUpdatedAt:
              now,

            medicalReportData:
              extractedData,

            updatedAt:
              now,
          },
        }
      );

      await digitalTwins.updateOne(
        {
          userId,
        },
        {
          $setOnInsert: {
            userId,

            patientName,

            createdAt:
              now,
          },

          $set: {
            medicalReportData:
              extractedData,

            medicalReportAnalyzed:
              true,

            medicalReportUpdatedAt:
              now,

            updatedAt:
              now,
          },
        },
        {
          upsert:
            true,
        }
      );

      res.json({
        message:
          "Medical report uploaded and analyzed successfully.",

        reportId:
          result.insertedId.toString(),

        userId,

        aiAnalyzed:
          true,

        extractedData,
      });
    } catch (error) {
      console.error(
        "Medical report AI analysis error:",
        error
      );

      const quotaMessage =
        getGeminiErrorMessage(
          error
        );

      res
        .status(
          quotaMessage
            ? 429
            : 500
        )
        .json({
          message:
            quotaMessage ||
            "Could not analyze the medical report. Please try again.",
        });
    }
  }
);

// ==================================================
// FOOD IMAGE UPLOAD
// ==================================================

app.post(
  "/food-images",
  requireAuth,
  upload.single("foodImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message:
            "No food image uploaded.",
        });
      }

      const database =
        getDatabase();

      const foodImages =
        database.collection(
          "foodImages"
        );

      const userId =
        req.authUserId;

      const foodImage = {
        userId,

        originalName:
          req.file.originalname,

        fileName:
          req.file.filename,

        filePath:
          req.file.path,

        fileType:
          req.file.mimetype,

        uploadedAt:
          new Date(),
      };

      const result =
        await foodImages.insertOne(
          foodImage
        );

      res.json({
        message:
          "Food image uploaded successfully.",

        foodImageId:
          result.insertedId.toString(),
      });
    } catch (error) {
      console.error(
        "Error uploading food image:",
        error
      );

      res.status(500).json({
        message:
          "Failed to upload food image.",
      });
    }
  }
);

// ==================================================
// SHARED USER FEEDBACK
// ==================================================

app.post(
  "/food-history",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const foodHistory =
        database.collection(
          "foodHistory"
        );

      const foodGenomes =
        database.collection(
          "foodGenomes"
        );

      const digitalTwins =
        database.collection(
          "digitalTwins"
        );

      const mealPlans =
        database.collection(
          "mealPlans"
        );

      const userId =
        req.authUserId;

      const patientName =
        String(
          req.body.patientName ||
            ""
        ).trim();

      const foodName =
        String(
          req.body.foodName ||
            ""
        ).trim();

      const status =
        String(
          req.body.status ||
            ""
        ).trim();

      const reaction =
        String(
          req.body.reaction ||
            ""
        ).trim();

      const notes =
        String(
          req.body.notes ||
            ""
        ).trim();

      const source =
        String(
          req.body.source ||
            "user_feedback"
        ).trim();

      const mealPlanId =
        String(
          req.body.mealPlanId ||
            ""
        ).trim();

      const goal =
        String(
          req.body.goal ||
            ""
        ).trim();

      const context =
        String(
          req.body.context ||
            ""
        ).trim();

      const customization =
        String(
          req.body.customization ||
            ""
        ).trim();

      const isFoodFeedback =
        source ===
        "food-analysis";

      const isMealPlanFeedback =
        source ===
        "meal-planner";

      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        isFoodFeedback &&
        !foodName
      ) {
        return res.status(400).json({
          message:
            "Food name is required for food feedback.",
        });
      }

      if (
        isMealPlanFeedback &&
        !mealPlanId
      ) {
        return res.status(400).json({
          message:
            "A saved meal plan ID is required for meal-plan feedback.",
        });
      }

      if (
        isMealPlanFeedback &&
        !ObjectId.isValid(
          mealPlanId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid meal plan ID.",
        });
      }

      if (!status) {
        return res.status(400).json({
          message:
            "Feedback status is required.",
        });
      }

      const validStatuses = [
        "loved",
        "liked",
        "neutral",
        "disliked",
      ];

      if (
        !validStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid feedback status.",
        });
      }

      const patient =
        await database
          .collection("patients")
          .findOne({
            userId,
          });

      const resolvedPatientName =
        patient?.name ||
        patientName;

      const now =
        new Date();

      // ==================================================
      // VERIFY EXACT MEAL PLAN
      // ==================================================

      let savedMealPlan =
        null;

      if (
        isMealPlanFeedback
      ) {
        savedMealPlan =
          await mealPlans.findOne({
            _id:
              new ObjectId(
                mealPlanId
              ),

            userId,
          });

        if (!savedMealPlan) {
          return res.status(404).json({
            message:
              "The saved meal plan could not be found.",
          });
        }
      }

      // ==================================================
      // FEEDBACK RECORD
      // ==================================================

      const feedbackRecord = {
        userId,

        patientName:
          resolvedPatientName,

        foodName:
          isFoodFeedback
            ? foodName
            : "",

        status,

        reaction,

        notes,

        source,

        recordedAt:
          now,
      };

      if (
        isMealPlanFeedback
      ) {
        feedbackRecord.mealPlanId =
          mealPlanId;

        feedbackRecord.goal =
          savedMealPlan.goal ||
          goal ||
          "";

        feedbackRecord.context =
          savedMealPlan.context ||
          context ||
          "";

        feedbackRecord.customization =
          savedMealPlan.customization ||
          customization ||
          "";
      }

      const result =
        await foodHistory.insertOne(
          feedbackRecord
        );

      // ==================================================
      // FOOD FEEDBACK
      // ==================================================

      if (
        isFoodFeedback
      ) {
        const genomeFoodEntry = {
          foodName,

          status,

          reaction,

          notes,

          source,

          recordedAt:
            now,
        };

        let preferenceField =
          null;

        if (status === "loved") {
          preferenceField =
            "lovedFoods";
        } else if (
          status === "liked"
        ) {
          preferenceField =
            "likedFoods";
        } else if (
          status === "neutral"
        ) {
          preferenceField =
            "neutralFoods";
        } else if (
          status === "disliked"
        ) {
          preferenceField =
            "dislikedFoods";
        }

        const genomeUpdate = {
          $setOnInsert: {
            userId,

            createdAt:
              now,
          },

          $set: {
            patientName:
              resolvedPatientName,

            updatedAt:
              now,

            lastFeedback:
              genomeFoodEntry,
          },

          $inc: {
            totalFeedback:
              1,
          },

          $push: {
            foods:
              genomeFoodEntry,
          },
        };

        if (
          preferenceField
        ) {
          genomeUpdate.$push[
            preferenceField
          ] = {
            foodName,

            reaction,

            notes,

            source,

            recordedAt:
              now,
          };
        }

        if (reaction) {
          genomeUpdate.$push.reactions = {
            foodName,

            reaction,

            recordedAt:
              now,
          };
        }

        await foodGenomes.updateOne(
          {
            userId,
          },

          genomeUpdate,

          {
            upsert:
              true,
          }
        );
      }

      // ==================================================
      // MEAL PLAN FEEDBACK
      // ==================================================

      if (
        isMealPlanFeedback
      ) {
        const mealPlanFeedback = {
          mealPlanId,

          status,

          reaction,

          notes,

          source,

          goal:
            savedMealPlan.goal ||
            goal ||
            "",

          context:
            savedMealPlan.context ||
            context ||
            "",

          customization:
            savedMealPlan.customization ||
            customization ||
            "",

          recordedAt:
            now,
        };

        await foodGenomes.updateOne(
          {
            userId,
          },

          {
            $setOnInsert: {
              userId,

              createdAt:
                now,
            },

            $set: {
              patientName:
                resolvedPatientName,

              updatedAt:
                now,

              lastMealPlanFeedback:
                mealPlanFeedback,
            },

            $push: {
              mealPlanFeedback:
                mealPlanFeedback,
            },
          },

          {
            upsert:
              true,
          }
        );

        await mealPlans.updateOne(
          {
            _id:
              new ObjectId(
                mealPlanId
              ),

            userId,
          },

          {
            $set: {
              latestFeedback:
                mealPlanFeedback,

              updatedAt:
                now,
            },

            $push: {
              feedbackHistory:
                mealPlanFeedback,
            },
          }
        );
      }

      // ==================================================
      // DIGITAL TWIN
      // ==================================================

      const twinFeedback = {
        foodName:
          isFoodFeedback
            ? foodName
            : "",

        status,

        reaction,

        notes,

        source,

        recordedAt:
          now,
      };

      if (
        isMealPlanFeedback
      ) {
        twinFeedback.mealPlanId =
          mealPlanId;

        twinFeedback.goal =
          savedMealPlan.goal ||
          goal ||
          "";

        twinFeedback.context =
          savedMealPlan.context ||
          context ||
          "";

        twinFeedback.customization =
          savedMealPlan.customization ||
          customization ||
          "";
      }

      await digitalTwins.updateOne(
        {
          userId,
        },

        {
          $setOnInsert: {
            userId,

            createdAt:
              now,
          },

          $set: {
            patientName:
              resolvedPatientName,

            updatedAt:
              now,

            lastDietaryFeedback:
              twinFeedback,
          },

          $inc: {
            feedbackCount:
              1,
          },

          $push: {
            dietaryFeedback:
              twinFeedback,
          },
        },

        {
          upsert:
            true,
        }
      );

      res.json({
        message:
          "Feedback saved and personalization data updated successfully.",

        foodHistoryId:
          result.insertedId.toString(),

        mealPlanId:
          isMealPlanFeedback
            ? mealPlanId
            : null,

        feedbackType:
          isMealPlanFeedback
            ? "meal-plan"
            : "food",

        updated: {
          foodGenome:
            true,

          digitalTwin:
            true,

          mealPlan:
            isMealPlanFeedback,
        },
      });
    } catch (error) {
      console.error(
        "Error saving user feedback:",
        error
      );

      res.status(500).json({
        message:
          "Failed to save user feedback.",
      });
    }
  }
);

// ==================================================
// GET FOOD GENOME BY PATIENT NAME
// ==================================================

app.get(
  "/food-genome/:patientName",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const foodGenomes =
        database.collection(
          "foodGenomes"
        );

      const patient =
        await database
          .collection("patients")
          .findOne({
            userId:
              req.authUserId,
          });

      if (
        patient &&
        patient.name !==
          req.params.patientName
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this Food Genome.",
        });
      }

      const genome =
        await foodGenomes.findOne({
          userId:
            req.authUserId,
        });

      if (!genome) {
        return res.json({
          userId:
            req.authUserId,

          patientName:
            patient?.name ||
            req.params.patientName,

          totalFeedback: 0,

          lovedFoods: [],

          likedFoods: [],

          neutralFoods: [],

          dislikedFoods: [],

          reactions: [],

          foods: [],

          mealPlanFeedback: [],
        });
      }

      res.json(genome);
    } catch (error) {
      console.error(
        "Food Genome retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve Food Genome.",
      });
    }
  }
);

// ==================================================
// GET FOOD GENOME BY USER ID
// ==================================================

app.get(
  "/food-genome/user/:userId",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const foodGenomes =
        database.collection(
          "foodGenomes"
        );

      if (
        normalizeUserId(
          req.params.userId
        ) !==
        req.authUserId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this Food Genome.",
        });
      }

      const userId =
        req.authUserId;

      const genome =
        await foodGenomes.findOne({
          userId,
        });

      if (!genome) {
        return res.json({
          userId,

          totalFeedback: 0,

          lovedFoods: [],

          likedFoods: [],

          neutralFoods: [],

          dislikedFoods: [],

          reactions: [],

          foods: [],

          mealPlanFeedback: [],
        });
      }

      res.json(genome);
    } catch (error) {
      console.error(
        "Food Genome user retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve Food Genome.",
      });
    }
  }
);

// ==================================================
// GET SAVED MEAL PLANS BY USER
// ==================================================

app.get(
  "/meal-plans/user/:userId",
  requireAuth,
  async (req, res) => {
    try {
      const requestedUserId =
        normalizeUserId(
          req.params.userId
        );

      if (
        requestedUserId !==
        req.authUserId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access these meal plans.",
        });
      }

      const mealPlans =
        getDatabase().collection(
          "mealPlans"
        );

      const plans =
        await mealPlans
          .find({
            userId:
              req.authUserId,
          })
          .sort({
            updatedAt:
              -1,
          })
          .limit(20)
          .toArray();

      res.json({
        mealPlans:
          plans,
      });
    } catch (error) {
      console.error(
        "Meal plans retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve saved meal plans.",
      });
    }
  }
);

// ==================================================
// GET ONE SAVED MEAL PLAN
// ==================================================

app.get(
  "/meal-plans/:mealPlanId",
  requireAuth,
  async (req, res) => {
    try {
      const mealPlanId =
        req.params.mealPlanId;

      if (
        !ObjectId.isValid(
          mealPlanId
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid meal plan ID.",
        });
      }

      const mealPlans =
        getDatabase().collection(
          "mealPlans"
        );

      const plan =
        await mealPlans.findOne({
          _id:
            new ObjectId(
              mealPlanId
            ),

          userId:
            req.authUserId,
        });

      if (!plan) {
        return res.status(404).json({
          message:
            "Saved meal plan not found.",
        });
      }

      res.json({
        mealPlan:
          plan,
      });
    } catch (error) {
      console.error(
        "Saved meal plan retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve the saved meal plan.",
      });
    }
  }
);

// ==================================================
// GET DIGITAL TWIN BY PATIENT NAME
// ==================================================

app.get(
  "/digital-twin/:patientName",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const digitalTwins =
        database.collection(
          "digitalTwins"
        );

      const patient =
        await database
          .collection("patients")
          .findOne({
            userId:
              req.authUserId,
          });

      if (
        patient &&
        patient.name !==
          req.params.patientName
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this Digital Twin.",
        });
      }

      const twin =
        await digitalTwins.findOne({
          userId:
            req.authUserId,
        });

      if (!twin) {
        return res.json({
          userId:
            req.authUserId,

          patientName:
            patient?.name ||
            req.params.patientName,

          feedbackCount: 0,

          healthProfile: null,

          dietaryFeedback: [],
        });
      }

      res.json(twin);
    } catch (error) {
      console.error(
        "Digital Twin retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve Digital Twin.",
      });
    }
  }
);

// ==================================================
// GET DIGITAL TWIN BY USER ID
// ==================================================

app.get(
  "/digital-twin/user/:userId",
  requireAuth,
  async (req, res) => {
    try {
      const database =
        getDatabase();

      const digitalTwins =
        database.collection(
          "digitalTwins"
        );

      if (
        normalizeUserId(
          req.params.userId
        ) !==
        req.authUserId
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to access this Digital Twin.",
        });
      }

      const userId =
        req.authUserId;

      const twin =
        await digitalTwins.findOne({
          userId,
        });

      if (!twin) {
        return res.json({
          userId,

          feedbackCount: 0,

          healthProfile: null,

          dietaryFeedback: [],
        });
      }

      res.json(twin);
    } catch (error) {
      console.error(
        "Digital Twin user retrieval error:",
        error
      );

      res.status(500).json({
        message:
          "Could not retrieve Digital Twin.",
      });
    }
  }
);

// ==================================================
// AI MEAL PLANNER
// ==================================================

app.post(
  "/meal-plan",
  requireAuth,
  async (req, res) => {
    try {
      const {
        goal,
        context,
        customization,
        mealPlanId,
      } = req.body;

      if (!goal) {
        return res.status(400).json({
          message:
            "Meal planning goal is required.",
        });
      }

      const cleanUserId =
        req.authUserId;

      const patient =
        await getAuthenticatedPatient(
          cleanUserId
        );

      if (!patient) {
        return res.status(404).json({
          message:
            "Health profile not found. Please complete your profile first.",
        });
      }

      const personalization =
        await getPersonalizationData(
          cleanUserId
        );

      const learning =
        buildFoodGenomeLearning(
          personalization.foodGenome
        );

      // ==================================================
      // CURRENT SAVED PLAN
      // ==================================================

      let currentSavedMealPlan =
        null;

      if (mealPlanId) {
        if (
          !ObjectId.isValid(
            mealPlanId
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid meal plan ID.",
          });
        }

        currentSavedMealPlan =
          await getDatabase()
            .collection(
              "mealPlans"
            )
            .findOne({
              _id:
                new ObjectId(
                  mealPlanId
                ),

              userId:
                cleanUserId,
            });

        if (
          !currentSavedMealPlan
        ) {
          return res.status(404).json({
            message:
              "The saved meal plan could not be found.",
          });
        }
      }

      // ==================================================
      // PREVIOUS MEAL PLAN MEMORY
      // ==================================================

      const previousMealPlans =
        await getPreviousMealPlans(
          cleanUserId,
          mealPlanId
        );

      const previousMealPlanContext =
        previousMealPlans.length > 0
          ? previousMealPlans
              .map(
                (
                  plan,
                  index
                ) => `
PREVIOUS MEAL PLAN ${index + 1}

Goal:
${plan.goal || "Not recorded"}

Context:
${plan.context || "None"}

Customization:
${plan.customization || "None"}

Created:
${
  plan.createdAt
    ? new Date(
        plan.createdAt
      ).toISOString()
    : "Unknown"
}

Plan:
${plan.mealPlan || "No plan content"}

Previous feedback:
${
  plan.latestFeedback
    ? JSON.stringify(
        plan.latestFeedback
      )
    : "No feedback recorded"
}
`
              )
              .join("\n\n")
          : "No previous personalized meal plans have been saved yet.";

      // ==================================================
      // CURRENT PLAN CONTEXT
      // ==================================================

      const currentMealPlanContext =
        currentSavedMealPlan
          ? `
CURRENT SAVED MEAL PLAN BEING CUSTOMIZED

This is the exact meal plan that the user wants to
customize/update.

Saved Meal Plan ID:
${mealPlanId}

Original Goal:
${
  currentSavedMealPlan.goal ||
  "Not recorded"
}

Original Context:
${
  currentSavedMealPlan.context ||
  "None"
}

Previous Customization:
${
  currentSavedMealPlan.customization ||
  "None"
}

Current Saved Plan:
${
  currentSavedMealPlan.mealPlan ||
  "No plan content"
}

Latest Feedback:
${
  currentSavedMealPlan.latestFeedback
    ? JSON.stringify(
        currentSavedMealPlan.latestFeedback
      )
    : "No feedback recorded"
}
`
          : "There is no currently saved meal plan being customized.";

      const prompt = `
You are an AI personalized dietary planning assistant.

Create a practical ONE-DAY meal plan.

PATIENT HEALTH PROFILE:
${JSON.stringify(
  patient,
  null,
  2
)}

DIGITAL TWIN:
${JSON.stringify(
  personalization.digitalTwin ||
    {},
  null,
  2
)}

FOOD GENOME:
${JSON.stringify(
  personalization.foodGenome ||
    {},
  null,
  2
)}

STRUCTURED FOOD GENOME LEARNING:
${JSON.stringify(
  learning,
  null,
  2
)}

PREVIOUS SAVED MEAL PLANS:
${previousMealPlanContext}

${currentMealPlanContext}

USER GOAL:
${goal}

CURRENT CONTEXT / DIETARY REQUIREMENTS:
${
  context ||
  "No additional context provided."
}

CUSTOMIZATION:
${
  customization ||
  "No customization requested."
}

==================================================
CURRENT PLAN UPDATE RULE
==================================================

If a CURRENT SAVED MEAL PLAN is provided:

The user is customizing that exact saved plan.

You MUST treat the CURRENT SAVED MEAL PLAN as the
starting point.

Do NOT create an unrelated new plan.

Update the existing plan according to the user's
customization request.

Preserve useful parts of the current plan unless the
customization requires changing them.

Return the COMPLETE updated one-day meal plan, not only
the changed section.

The saved plan will be updated under the same mealPlanId.

==================================================
PREVIOUS MEAL PLAN MEMORY
==================================================

Previous meal plans are stored dietary history.

Use them as additional context.

Do NOT blindly repeat the same complete meals from
previous plans when other suitable options are available.

You may reuse foods when they are appropriate, but try to
provide useful variety across future recommendations.

If the user explicitly asks for a previous meal or food,
it can be reused.

If a previous plan received negative feedback, avoid
repeating the aspects that were specifically associated
with that feedback.

If previous plans have no feedback, simply treat them as
historical context.

The previous plans are NOT medical instructions.

==================================================
CORE PERSONALIZATION PRINCIPLE
==================================================

LIKE DOES NOT AUTOMATICALLY MEAN SUITABLE.

A food can be loved or liked while also having negative
personal reactions.

Example:

Pizza:
- Preference: loved
- Previous reaction: acidity, bloating

Correct reasoning:

The user enjoys pizza, but previous personal experience
shows unwanted reactions.

Therefore pizza should NOT automatically be prioritized
because the user likes it.

Consider:
- portion size
- preparation
- frequency
- lighter alternatives
- other foods with similar nutritional purpose

==================================================
FOOD REACTION LEARNING
==================================================

Use explicitly recorded reactions.

Do not invent reactions.

Do not diagnose medical conditions from reactions.

If a reaction could represent a potentially serious allergic
or medical concern, do not diagnose it. Recommend appropriate
professional medical evaluation.

A single recorded experience should not permanently ban
a food.

Two or more recorded experiences should be treated as an
emerging personal pattern.

Three or more recorded experiences should be treated as a
stronger repeated personal pattern.

The number of experiences indicates learning strength.
Do not claim that different free-text reactions are identical
unless explicitly recorded that way.

==================================================
FOOD PREFERENCE RULES
==================================================

Use:

- loved foods
- liked foods
- neutral foods
- disliked foods

But NEVER use preference alone to determine suitability.

Priority should consider:

1. Explicit allergies
2. Explicit dietary restrictions
3. Explicit medical information
4. Previous negative reactions
5. Repeated personal patterns
6. Nutrition
7. Food preference

Disliked foods should generally not be recommended unless
explicitly requested.

Foods with repeated negative reactions should generally be
given lower priority even if they are liked.

==================================================
EXPLICIT FOOD REQUEST
==================================================

If the user explicitly requests a food that has previous
negative reactions, do not silently remove it.

If appropriate, include it with a clear caution and provide
a safer or lighter alternative.

==================================================
MEAL PLAN FEEDBACK
==================================================

Meal-plan feedback is learning about the quality and
suitability of previous meal plans.

Use it to improve future plans.

Do NOT treat "Personalized Meal Plan" as an actual food.

==================================================
DIGITAL TWIN
==================================================

Use the Digital Twin for health-related dietary context.

Only use information explicitly available in the profile,
medical report, or stored dietary experiences.

Do not invent medical information.

Do not diagnose diseases.

Do not promise medical outcomes.

==================================================
DIETARY REQUIREMENTS
==================================================

If vegan:

No meat, chicken, fish, seafood, eggs, milk, curd/yogurt,
paneer, cheese, butter, ghee, or other animal-derived foods.

If vegetarian:

No meat, chicken, fish, or seafood.

Eggs should only be included if explicitly allowed.

If an allergy or explicit food avoidance exists:
NEVER recommend that food or ingredient.

==================================================
CUSTOMIZATION
==================================================

Follow the user's customization request whenever it does not
conflict with health, allergy, or dietary restrictions.

The updated plan should actually reflect the customization.

==================================================
RESPONSE
==================================================

Return:

## Breakfast

## Mid-Morning Snack

## Lunch

## Evening Snack

## Dinner

## Why This Plan

Explain important personalization factors.

## Food Genome Considerations

Mention relevant preferences, previous reactions, and repeated
patterns that affected the plan.

If there are no relevant learned food patterns, say so.

## Alternatives

Give 2-3 alternatives.

## Missing Information

Mention important information that could improve personalization.

Clearly state that this is dietary guidance and not a replacement
for professional medical advice.
`;

      const response =
        await gemini.models.generateContent({
          model:
            "gemini-3.5-flash",

          contents:
            prompt,
        });

      const generatedMealPlan =
        response.text || "";

      const mealPlans =
        getDatabase().collection(
          "mealPlans"
        );

      const now =
        new Date();

      let savedMealPlanId =
        null;

      // ==================================================
      // UPDATE EXISTING PLAN
      // ==================================================

      if (
        currentSavedMealPlan
      ) {
        const previousVersion = {
          mealPlan:
            currentSavedMealPlan.mealPlan ||
            "",

          goal:
            currentSavedMealPlan.goal ||
            "",

          context:
            currentSavedMealPlan.context ||
            "",

          customization:
            currentSavedMealPlan.customization ||
            "",

          savedAt:
            currentSavedMealPlan.updatedAt ||
            currentSavedMealPlan.createdAt ||
            now,
        };

        await mealPlans.updateOne(
          {
            _id:
              currentSavedMealPlan._id,

            userId:
              cleanUserId,
          },

          {
            $set: {
              patientName:
                patient.name ||
                "",

              goal,

              context:
                String(
                  context || ""
                ).trim(),

              customization:
                String(
                  customization ||
                    ""
                ).trim(),

              mealPlan:
                generatedMealPlan,

              updatedAt:
                now,
            },

            $push: {
              versions:
                previousVersion,
            },
          }
        );

        savedMealPlanId =
          currentSavedMealPlan._id.toString();
      }

      // ==================================================
      // CREATE NEW PLAN
      // ==================================================

      if (!savedMealPlanId) {
        const newMealPlan = {
          userId:
            cleanUserId,

          patientName:
            patient.name ||
            "",

          goal,

          context:
            String(
              context || ""
            ).trim(),

          customization:
            String(
              customization ||
                ""
            ).trim(),

          mealPlan:
            generatedMealPlan,

          createdAt:
            now,

          updatedAt:
            now,

          versions:
            [],

          feedbackHistory:
            [],
        };

        const result =
          await mealPlans.insertOne(
            newMealPlan
          );

        savedMealPlanId =
          result.insertedId.toString();
      }

      console.log(
        `Meal plan saved successfully: ${savedMealPlanId}`
      );

      res.json({
        mealPlan:
          generatedMealPlan,

        mealPlanId:
          savedMealPlanId,

        saved:
          true,

        updated:
          Boolean(
            currentSavedMealPlan
          ),
      });
    } catch (error) {
      console.error(
        "Meal planner error:",
        error
      );

      const quotaMessage =
        getGeminiErrorMessage(
          error
        );

      res
        .status(
          quotaMessage
            ? 429
            : 500
        )
        .json({
          message:
            quotaMessage ||
            "Could not generate personalized meal plan.",
        });
    }
  }
);

// ==================================================
// PERSONALIZED AI ANALYSIS
// ==================================================

app.post(
  "/personalized-analysis",
  requireAuth,
  async (req, res) => {
    try {
      const {
        food,
        nutrition,
      } = req.body;

      if (
        !food ||
        !nutrition
      ) {
        return res.status(400).json({
          message:
            "Food and nutrition data are required.",
        });
      }

      const cleanUserId =
        req.authUserId;

      const patient =
        await getAuthenticatedPatient(
          cleanUserId
        );

      if (!patient) {
        return res.status(404).json({
          message:
            "Health profile not found. Please complete your profile first.",
        });
      }

      const personalization =
        await getPersonalizationData(
          cleanUserId
        );

      const learning =
        buildFoodGenomeLearning(
          personalization.foodGenome
        );

      const currentFoodName =
        String(
          food?.foodName ||
            ""
        )
          .trim()
          .toLowerCase();

      const currentFoodPatterns =
        learning.learnedPatterns.filter(
          (pattern) =>
            pattern.foodName
              .trim()
              .toLowerCase() ===
            currentFoodName
        );

      const currentFoodPreferences =
        learning.preferences.filter(
          (preference) =>
            preference.foodName
              .trim()
              .toLowerCase() ===
            currentFoodName
        );

      const prompt = `
You are a personalized dietary intelligence assistant.

Analyze this food for the user's health profile and previous
personal food experiences.

PATIENT HEALTH PROFILE:
${JSON.stringify(
  patient,
  null,
  2
)}

DIGITAL TWIN:
${JSON.stringify(
  personalization.digitalTwin ||
    {},
  null,
  2
)}

FOOD GENOME:
${JSON.stringify(
  personalization.foodGenome ||
    {},
  null,
  2
)}

STRUCTURED FOOD GENOME LEARNING:
${JSON.stringify(
  learning,
  null,
  2
)}

PREVIOUS PREFERENCES FOR CURRENT FOOD:
${JSON.stringify(
  currentFoodPreferences,
  null,
  2
)}

PREVIOUS EXPERIENCES WITH CURRENT FOOD:
${JSON.stringify(
  currentFoodPatterns,
  null,
  2
)}

IDENTIFIED FOOD:
${JSON.stringify(
  food,
  null,
  2
)}

NUTRITION:
${JSON.stringify(
  nutrition,
  null,
  2
)}

==================================================
CORE PERSONALIZATION PRINCIPLE
==================================================

LIKE DOES NOT AUTOMATICALLY MEAN SUITABLE.

A user can enjoy a food while also experiencing an unwanted
physical reaction.

Example:

Pizza:
Preference = liked/loved
Previous reactions = acidity, bloating

Correct reasoning:

- The user likes pizza.
- The user has previously reported acidity and bloating.
- Therefore liking pizza does NOT automatically make pizza
  suitable.
- The previous reaction must be included in the assessment.
- Provide appropriate caution and an alternative when relevant.

==================================================
PREVIOUS FOOD EXPERIENCE
==================================================

If previous experiences exist for the current food:

1. Mention them when relevant.
2. Treat them as personal user-reported evidence.
3. Do not turn them into a medical diagnosis.
4. Do not invent additional symptoms.
5. Consider repeated experiences more strongly.

Do not assume a reaction is an allergy unless the user or
medical report explicitly identifies it as an allergy.

If the recorded reaction could indicate a potentially serious
allergic or medical issue, recommend appropriate professional
medical evaluation without diagnosing the user.

Learning strength:

1 experience:
single recorded experience

2 experiences:
emerging repeated pattern

3+ experiences:
strong repeated pattern

Do not claim that different free-text reactions are identical
unless explicitly stated by the user.

==================================================
PREFERENCE VS REACTION
==================================================

Keep these signals separate:

Preference:
- loved
- liked
- neutral
- disliked

Reaction:
- user-reported physical or experiential response

A positive preference must NOT override an important negative
personal reaction.

A negative reaction should influence suitability.

==================================================
SUITABILITY
==================================================

Choose one:

- Generally suitable
- Suitable with caution
- Less suitable

Base the assessment on:

1. Explicit allergies
2. Explicit dietary restrictions
3. Explicit medical information
4. Nutrition
5. Food Genome preference
6. Previous reactions
7. Repeated personal patterns

Do not diagnose.

Do not claim guaranteed medical outcomes.

==================================================
EXPLICIT REQUEST
==================================================

If the user explicitly asks for a food that has previous
negative reactions, do not silently prohibit it.

Instead:

- acknowledge the previous reaction
- explain the relevant caution
- suggest a modification or portion consideration when
  appropriate
- provide an alternative

==================================================
RESPONSE
==================================================

Provide:

## Suitability

State one of:
Generally suitable
Suitable with caution
Less suitable

## Reason

Explain why.

## Positive Points

Mention useful nutritional or dietary positives.

## Things to Watch

Mention relevant nutritional factors or previous personal
reactions.

## Recommendation

Give practical guidance.

## Personalization Insight

Explicitly mention previous experiences with this food when
available.

For example:

"You previously reported acidity and bloating after pizza,
so although you like pizza, your Food Genome has learned that
you may want to approach it with caution."

Do not invent this statement unless those reactions are actually
present in the stored data.

Clearly distinguish dietary guidance from medical advice.
`;

      const response =
        await gemini.models.generateContent({
          model:
            "gemini-3.5-flash",

          contents:
            prompt,
        });

      res.json({
        analysis:
          response.text,
      });
    } catch (error) {
      console.error(
        "Gemini personalized analysis error:",
        error
      );

      const quotaMessage =
        getGeminiErrorMessage(
          error
        );

      res
        .status(
          quotaMessage
            ? 429
            : 500
        )
        .json({
          message:
            quotaMessage ||
            "Could not generate personalized analysis.",
        });
    }
  }
);

// ==================================================
// START SERVER
// ==================================================

const server =
  app.listen(
    PORT,
    "0.0.0.0",
    async () => {
      console.log(
        `Backend server running on port ${PORT}`
      );

      console.log(
        `Allowed frontend origin: ${CLIENT_URL}`
      );

      console.log(
        `Authentication: MongoDB HTTP-only sessions`
      );

      await connectToDatabase();
    }
  );

server.on(
  "error",
  (error) => {
    console.error(
      "Server error:",
      error
    );
  }
);