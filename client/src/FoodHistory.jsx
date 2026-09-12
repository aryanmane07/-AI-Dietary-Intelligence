import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function FoodHistory({
  patientData,
  onContinue,
  feedbackContext,
}) {
  const [status, setStatus] =
    useState("");

  const [reaction, setReaction] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==================================================
  // FEEDBACK TYPE
  // ==================================================

  /*
   * Meal-plan feedback is identified by its
   * explicit type rather than by foodName.
   *
   * This is important because a meal plan is
   * not a food and must not be added to the
   * Food Genome as a food preference.
   */
  const isMealPlanFeedback =
    feedbackContext?.type ===
    "meal-plan";

  const foodName =
    isMealPlanFeedback
      ? ""
      : feedbackContext?.foodName ||
        "";

  const isFoodFeedback =
    !isMealPlanFeedback &&
    Boolean(foodName);

  /*
   * The permanent ID of the saved meal plan.
   *
   * This allows the backend to attach the
   * feedback to the exact generated plan.
   */
  const mealPlanId =
    feedbackContext?.mealPlanId ||
    null;

  const goal =
    feedbackContext?.goal ||
    "";

  const context =
    feedbackContext?.context ||
    "";

  const customization =
    feedbackContext?.customization ||
    "";

  const title = isFoodFeedback
    ? `How was your ${foodName.toLowerCase()}?`
    : "How was your meal plan?";

  const subtitle = isFoodFeedback
    ? "Your experience helps your Food Genome learn both what you prefer and how your body responds to different foods."
    : "Your feedback helps the system understand what works for you and improve future personalized meal recommendations.";

  // ==================================================
  // EXPERIENCE OPTIONS
  // ==================================================

  const experienceOptions = [
    {
      value: "loved",
      title: "Loved it",
      description:
        "I really enjoyed this.",
    },
    {
      value: "liked",
      title: "Pretty good",
      description:
        "I would have it again.",
    },
    {
      value: "neutral",
      title: "It was okay",
      description:
        "I have no strong preference.",
    },
    {
      value: "disliked",
      title: "Not for me",
      description:
        "I would prefer something else.",
    },
  ];

  // ==================================================
  // SAVE FEEDBACK
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!status) {
      setMessage(
        "Please tell us how your experience was."
      );
      return;
    }

    if (!patientData?.userId) {
      setMessage(
        "No user account was found. Please log in again."
      );
      return;
    }

    /*
     * Meal-plan feedback must have a real saved
     * mealPlanId so it can be connected to the
     * exact plan the user is reviewing.
     */
    if (
      isMealPlanFeedback &&
      !mealPlanId
    ) {
      setMessage(
        "The saved meal plan could not be identified. Please generate the meal plan again."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `${API_URL}/food-history`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              patientName:
                patientData?.name ||
                "",

              /*
               * Only food-analysis feedback
               * sends a food name.
               *
               * Meal-plan feedback is linked
               * through mealPlanId instead.
               */
              foodName:
                isFoodFeedback
                  ? foodName
                  : "",

              status,

              reaction:
                reaction.trim(),

              notes:
                notes.trim(),

              /*
               * Food analysis and meal planner
               * are stored as different feedback
               * sources by the backend.
               */
              source:
                isFoodFeedback
                  ? "food-analysis"
                  : "meal-planner",

              /*
               * Connect feedback to the exact
               * saved meal plan.
               */
              mealPlanId:
                isMealPlanFeedback
                  ? mealPlanId
                  : null,

              /*
               * These provide additional context
               * for meal-plan feedback.
               */
              goal:
                isMealPlanFeedback
                  ? goal
                  : "",

              context:
                isMealPlanFeedback
                  ? context
                  : "",

              customization:
                isMealPlanFeedback
                  ? customization
                  : "",
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not save your feedback."
        );

        return;
      }

      setMessage(
        isFoodFeedback
          ? "Your food experience has been added to your Food Genome."
          : "Your meal plan feedback has been saved to the exact personalized plan."
      );

      setTimeout(() => {
        if (onContinue) {
          onContinue();
        }
      }, 1000);
    } catch (error) {
      console.error(
        "Feedback error:",
        error
      );

      setMessage(
        "Could not connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="food-history-page">

      <div className="food-history-card">

        {/* =========================
            BRAND
        ========================= */}

        <div className="food-history-logo">

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
          USER FEEDBACK
        </p>

        <h1>
          {title}
        </h1>

        <p className="food-history-subtitle">
          {subtitle}
        </p>

        {/* =========================
            FOOD CONTEXT
        ========================= */}

        {isFoodFeedback && (
          <div className="food-history-context">

            <span>
              FOOD EXPERIENCE
            </span>

            <strong>
              {foodName}
            </strong>

            <p>
              Your preference and physical
              reaction are recorded separately.
            </p>

          </div>
        )}

        {/* =========================
            MEAL PLAN CONTEXT
        ========================= */}

        {isMealPlanFeedback && (
          <div className="food-history-context">

            <span>
              PERSONALIZED MEAL PLAN
            </span>

            <strong>
              {goal ||
                "Personalized Meal Plan"}
            </strong>

            {context && (
              <p>
                Context: {context}
              </p>
            )}

            {customization && (
              <p>
                Latest customization:{" "}
                {customization}
              </p>
            )}

            <p>
              Your feedback will be linked to
              this exact saved meal plan.
            </p>

          </div>
        )}

        {/* =========================
            FEEDBACK FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* =========================
              PREFERENCE
          ========================= */}

          <div className="food-history-field">

            <label>
              Your Preference
            </label>

            <p className="food-history-help">
              Tell us how much you liked the food
              or meal plan.
            </p>

            <div className="feedback-options">

              {experienceOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    className={`feedback-option ${
                      status ===
                      option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setStatus(
                        option.value
                      )
                    }
                    disabled={loading}
                  >

                    <strong>
                      {option.title}
                    </strong>

                    <span>
                      {option.description}
                    </span>

                  </button>
                )
              )}

            </div>

          </div>

          {/* =========================
              PHYSICAL REACTION
          ========================= */}

          <div className="food-history-field">

            <label>
              {isFoodFeedback
                ? "How did you feel afterward?"
                : "How did the meal plan work for you?"}
            </label>

            <p className="food-history-help">
              {isFoodFeedback
                ? "Record any physical reaction or how your body responded."
                : "Tell us about your experience with the plan, such as fullness, energy, convenience, variety, or anything that did not work."}
            </p>

            <input
              type="text"
              placeholder={
                isFoodFeedback
                  ? "Example: acidity, bloating, felt great, stomach discomfort..."
                  : "Example: felt energetic, too full, hungry later, portions were too large..."
              }
              value={
                reaction
              }
              onChange={(e) =>
                setReaction(
                  e.target.value
                )
              }
              disabled={loading}
            />

          </div>

          {/* =========================
              NOTES
          ========================= */}

          <div className="food-history-field">

            <label>
              Anything else to remember?
            </label>

            <p className="food-history-help">
              Add details that may help the system
              understand your experience.
            </p>

            <textarea
              placeholder={
                isFoodFeedback
                  ? "Example: large portion, spicy preparation, enjoyed the taste but felt bloated afterward..."
                  : "Example: preferred a lighter dinner, would like cheaper options next time..."
              }
              value={
                notes
              }
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows="4"
              disabled={loading}
            />

          </div>

          {/* =========================
              SAVE
          ========================= */}

          <button
            type="submit"
            className="food-history-button"
            disabled={loading}
          >
            {loading
              ? "Learning From Your Feedback..."
              : "Save My Feedback →"}
          </button>

        </form>

        {/* =========================
            LEARNING INFORMATION
        ========================= */}

        <div className="food-history-learning">

          <div className="food-history-learning-icon">
            AI
          </div>

          <div>

            <strong>
              Your feedback becomes intelligence
            </strong>

            <p>
              {isFoodFeedback
                ? "Your Food Genome remembers both your preference and your physical reaction. Future food analysis and meal planning can use both signals."
                : "Your feedback helps the system improve future meal plans based on your preferences and previous experiences."}
            </p>

          </div>

        </div>

        {/* =========================
            PREFERENCE VS SUITABILITY
        ========================= */}

        {isFoodFeedback && (
          <div className="food-history-learning">

            <div className="food-history-learning-icon">
              AI
            </div>

            <div>

              <strong>
                Preference and suitability are different
              </strong>

              <p>
                You may enjoy a food while still
                experiencing an unwanted reaction.
                The system keeps these signals
                separate so a liked food is not
                automatically treated as suitable.
              </p>

            </div>

          </div>
        )}

        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default FoodHistory;