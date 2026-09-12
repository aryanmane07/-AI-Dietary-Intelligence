import { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function MealPlanner({
  patientData,
  onMealPlanCompleted,
}) {
  const [goal, setGoal] = useState("");

  const [context, setContext] = useState("");

  const [customization, setCustomization] =
    useState("");

  const [mealPlan, setMealPlan] = useState("");

  const [mealPlanId, setMealPlanId] = useState("");

  const [lastCustomization, setLastCustomization] =
    useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // ==================================================
  // GENERATE / UPDATE MEAL PLAN
  // ==================================================

  async function generateMealPlan(
    customRequest = "",
    existingMealPlanId = null
  ) {
    if (!goal) {
      setMessage("Please select a goal.");
      return;
    }

    if (!patientData?.userId) {
      setMessage(
        "No user account was found. Please log in again."
      );
      return;
    }

    setLoading(true);

    setMessage(
      customRequest
        ? "Updating your personalized meal plan..."
        : "Generating your personalized meal plan..."
    );

    setMealPlan("");

    try {
      const response = await fetch(
        `${API_URL}/meal-plan`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            patient: patientData,

            goal,

            context: context.trim(),

            customization: customRequest,

            /*
             * null = create a completely new plan
             *
             * existing ID = update that exact saved plan
             */
            mealPlanId:
              existingMealPlanId || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not generate meal plan."
        );
        return;
      }

      setMealPlan(data.mealPlan || "");

      /*
       * IMPORTANT:
       *
       * Accept the saved MongoDB ID from the backend
       * regardless of whether the response calls it:
       *
       * mealPlanId
       * id
       * _id
       *
       * For customization, if the backend does not return
       * the ID again, keep the existing ID.
       */
      const returnedMealPlanId =
        data.mealPlanId ||
        data.id ||
        data._id ||
        existingMealPlanId ||
        "";

      if (returnedMealPlanId) {
        setMealPlanId(
          String(returnedMealPlanId)
        );
      } else {
        /*
         * The plan was returned but there is no ID.
         * Do not pretend that it can be linked to feedback.
         */
        setMealPlanId("");
      }

      /*
       * Remember only the customization that was actually
       * incorporated into the saved meal plan.
       */
      if (customRequest) {
        setLastCustomization(
          customRequest
        );
      } else {
        setLastCustomization("");
      }

      setMessage(
        customRequest
          ? "Meal plan updated successfully and saved to your Food Genome history."
          : "Personalized meal plan generated and saved successfully."
      );

      /*
       * The customization request has now been
       * incorporated into the saved plan.
       */
      if (customRequest) {
        setCustomization("");
      }
    } catch (error) {
      console.error(
        "Meal planner error:",
        error
      );

      setMessage(
        "Could not connect to the meal planner."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // INITIAL PLAN
  // ==================================================

  function handleSubmit(e) {
    e.preventDefault();

    /*
     * Always create a new saved plan here.
     *
     * Pass null directly so React's asynchronous
     * state updates cannot accidentally send an old ID.
     */
    setMealPlanId("");
    setMealPlan("");
    setLastCustomization("");
    setCustomization("");

    generateMealPlan("", null);
  }

  // ==================================================
  // CUSTOMIZATION
  // ==================================================

  function handleCustomization(e) {
    e.preventDefault();

    if (!customization.trim()) {
      setMessage(
        "Please enter how you want to customize the meal plan."
      );
      return;
    }

    if (!mealPlanId) {
      setMessage(
        "Please generate a meal plan before customizing it."
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Send the exact currently saved plan ID.
     *
     * This means customization updates the same
     * MongoDB meal-plan document instead of creating
     * another unrelated plan.
     */
    generateMealPlan(
      customization.trim(),
      mealPlanId
    );
  }

  // ==================================================
  // CONTINUE TO SHARED FEEDBACK
  // ==================================================

  function handleContinueToFeedback() {
    /*
     * Feedback must always point to an actual
     * saved meal-plan record.
     */
    if (!mealPlanId) {
      setMessage(
        "This meal plan has not been saved correctly. Please generate the plan again."
      );
      return;
    }

    /*
     * Normalize the ID before passing it to App.jsx.
     */
    const savedMealPlanId =
      String(mealPlanId);

    console.log(
      "Sending meal plan to feedback:",
      {
        mealPlanId:
          savedMealPlanId,
        goal,
        context:
          context.trim(),
        customization:
          lastCustomization,
      }
    );

    if (onMealPlanCompleted) {
      onMealPlanCompleted({
        type: "meal-plan",

        /*
         * This exact ID is passed through:
         *
         * MealPlanner
         *      ↓
         * App.jsx
         *      ↓
         * FoodHistory
         *      ↓
         * POST /food-history
         *
         * The backend then attaches the feedback
         * to this exact saved meal plan.
         */
        mealPlanId:
          savedMealPlanId,

        goal,

        context:
          context.trim(),

        customization:
          lastCustomization,

        /*
         * A meal plan is not an individual food.
         */
        foodName: "",
      });
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="food-page">

      <div className="food-card">

        {/* =========================
            BRAND
        ========================= */}

        <div className="food-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        {/* =========================
            HEADER
        ========================= */}

        <p className="section-label">
          PERSONALIZED MEAL PLANNER
        </p>

        <h1>
          What Should I Eat?
        </h1>

        <p className="food-subtitle">
          Set your goal and current context.
          Your health profile, Digital Twin,
          Food Genome, previous experiences,
          and previous meal plans are used
          to create a personalized plan.
        </p>

        {/* =========================
            PROCESS
        ========================= */}

        <div className="food-process">

          <span>
            Goal
          </span>

          <span>
            →
          </span>

          <span>
            Plan
          </span>

          <span>
            →
          </span>

          <span>
            Alternatives
          </span>

          <span>
            →
          </span>

          <span>
            Customize
          </span>

          <span>
            →
          </span>

          <span>
            Feedback
          </span>

        </div>

        {/* =========================
            GOAL + CONTEXT
        ========================= */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="login-field">

            <label>
              Goal
            </label>

            <select
              value={goal}
              onChange={(e) =>
                setGoal(
                  e.target.value
                )
              }
              required
              disabled={loading}
            >

              <option value="">
                Select your goal
              </option>

              <option value="Healthy eating">
                Healthy eating
              </option>

              <option value="Weight loss">
                Weight loss
              </option>

              <option value="Weight gain">
                Weight gain
              </option>

              <option value="Muscle building">
                Muscle building
              </option>

              <option value="Blood sugar control">
                Blood sugar control
              </option>

              <option value="Blood pressure management">
                Blood pressure management
              </option>

              <option value="Balanced diet">
                Balanced diet
              </option>

            </select>

          </div>

          <div className="login-field">

            <label>
              Current Context
            </label>

            <textarea
              value={context}
              onChange={(e) =>
                setContext(
                  e.target.value
                )
              }
              placeholder="Example: vegetarian, college student, prefers Indian food, needs quick meals..."
              rows="5"
              disabled={loading}
            />

          </div>

          <button
            type="submit"
            className="food-button"
            disabled={loading}
          >
            {loading
              ? "Generating Meal Plan..."
              : "Generate Meal Plan →"}
          </button>

        </form>

        {/* =========================
            STATUS
        ========================= */}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

        {/* =========================
            GENERATED PLAN
        ========================= */}

        {mealPlan && (
          <>

            <div className="food-result">

              <p className="section-label">
                PERSONALIZED PLAN
              </p>

              <h2>
                Your Personalized Meal Plan
              </h2>

              <div className="ai-analysis-content">

                <ReactMarkdown>
                  {mealPlan}
                </ReactMarkdown>

              </div>

              {mealPlanId && (
                <div
                  style={{
                    marginTop: "18px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#f0f8f4",
                    color: "#2c6d58",
                    fontSize: "12px",
                  }}
                >
                  This meal plan has been saved.
                  Future recommendations can
                  learn from it.
                </div>
              )}

            </div>

            {/* =========================
                CUSTOMIZATION
            ========================= */}

            <div className="food-result">

              <p className="section-label">
                ALTERNATIVES & CUSTOMIZATION
              </p>

              <h2>
                Adjust Your Plan
              </h2>

              <p className="food-subtitle">
                Ask for substitutions, different
                meal styles, budget-friendly options,
                lighter meals, or any other change.
                Your health profile, Food Genome,
                and previous meal-plan history
                remain part of the analysis.
              </p>

              <form
                onSubmit={
                  handleCustomization
                }
              >

                <div className="login-field">

                  <label>
                    Customize Your Meal Plan
                  </label>

                  <textarea
                    value={
                      customization
                    }
                    onChange={(e) =>
                      setCustomization(
                        e.target.value
                      )
                    }
                    placeholder="Example: Replace paneer with dal, give cheaper options, make dinner lighter, avoid dairy, use meals that take less than 20 minutes..."
                    rows="5"
                    disabled={loading}
                  />

                </div>

                <button
                  type="submit"
                  className="food-button"
                  disabled={
                    loading ||
                    !mealPlanId
                  }
                >
                  {loading
                    ? "Updating Plan..."
                    : "Update Meal Plan →"}
                </button>

              </form>

            </div>

            {/* =========================
                FEEDBACK
            ========================= */}

            <div className="food-result">

              <p className="section-label">
                USER FEEDBACK
              </p>

              <h2>
                How Was This Meal Plan?
              </h2>

              <p className="food-subtitle">
                Your feedback helps the system
                learn what works for you and improve
                future meal recommendations.
              </p>

              <button
                type="button"
                className="food-button"
                onClick={
                  handleContinueToFeedback
                }
                disabled={
                  loading ||
                  !mealPlanId
                }
              >
                Continue to Feedback →
              </button>

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default MealPlanner;