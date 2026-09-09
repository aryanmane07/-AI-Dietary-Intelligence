const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Test route
app.get("/", (req, res) => {
  res.send("AI Dietary Intelligence Backend is running!");
});

// Login route
app.post("/login", (req, res) => {
  console.log("Login request received:", req.body);

  res.json({
    message: "Login request received",
  });
});

// Patient profile route
app.post("/patients", async (req, res) => {
  try {
    const database = client.db("dietaryAI");
    const patients = database.collection("patients");

    const patient = req.body;

    const result = await patients.insertOne(patient);

    res.json({
      message: "Patient profile saved successfully!",
      patientId: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving patient:", error);

    res.status(500).json({
      message: "Failed to save patient profile",
    });
  }
});

// Medical report upload route
app.post(
  "/medical-reports",
  upload.single("medicalReport"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No medical report uploaded.",
        });
      }

      const database = client.db("dietaryAI");
      const reports = database.collection("medicalReports");

      const report = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        uploadedAt: new Date(),
      };

      const result = await reports.insertOne(report);

      res.json({
        message: "Medical report uploaded successfully!",
        reportId: result.insertedId,
      });
    } catch (error) {
      console.error("Error uploading medical report:", error);

      res.status(500).json({
        message: "Failed to upload medical report.",
      });
    }
  }
);

// Start server
const server = app.listen(PORT, "127.0.0.1", async () => {
  console.log(
    `Backend server running on http://127.0.0.1:${PORT}`
  );

  await connectToDatabase();
});

server.on("error", (error) => {
  console.error("Server error:", error);
});