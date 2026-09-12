import { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function FoodUpload({
  onFoodUploaded,
  patientData,
}) {
  const [file, setFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [foodResult, setFoodResult] =
    useState(null);

  const [nutrition, setNutrition] =
    useState(null);

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // ==================================================
  // FILE SELECTION
  // ==================================================

  function handleFileChange(e) {
    const selectedFile =
      e.target.files?.[0] || null;

    setFile(selectedFile);
    setMessage("");
    setFoodResult(null);
    setNutrition(null);
    setAnalysis(null);
  }

  // ==================================================
  // FOOD ANALYSIS FLOW
  //
  // Upload
  //   ↓
  // Recognition
  //   ↓
  // USDA Nutrition
  //   ↓
  // Digital Twin + Food Genome
  //   ↓
  // Personalized AI Analysis
  //   ↓
  // User Feedback
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setMessage(
        "Please select a food image first."
      );
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
      "Recognizing food..."
    );

    setFoodResult(null);
    setNutrition(null);
    setAnalysis(null);

    const formData =
      new FormData();

    formData.append(
      "foodImage",
      file
    );

    try {
      // ==================================================
      // STEP 1 — FOOD RECOGNITION
      // ==================================================

      const recognitionResponse =
        await fetch(
          `${API_URL}/recognize-food`,
          {
            method: "POST",

            credentials:
              "include",

            body: formData,
          }
        );

      const recognitionData =
        await recognitionResponse.json();

      if (
        !recognitionResponse.ok
      ) {
        setMessage(
          recognitionData.message ||
            "Food recognition failed."
        );

        return;
      }

      setFoodResult(
        recognitionData
      );

      // ==================================================
      // STEP 2 — USDA NUTRITION
      // ==================================================

      setMessage(
        "Food recognized. Getting nutrition information..."
      );

      const nutritionResponse =
        await fetch(
          `${API_URL}/nutrition?food=${encodeURIComponent(
            recognitionData.foodName
          )}`,
          {
            method: "GET",
          }
        );

      const nutritionData =
        await nutritionResponse.json();

      if (
        !nutritionResponse.ok
      ) {
        setMessage(
          "Food was recognized, but nutrition information was not found."
        );

        return;
      }

      setNutrition(
        nutritionData
      );

      // ==================================================
      // STEP 3 — PERSONALIZED ANALYSIS
      // ==================================================

      setMessage(
        "Checking your Digital Twin and Food Genome..."
      );

      /*
       * The backend identifies the authenticated
       * user through the HTTP-only session cookie.
       *
       * It retrieves:
       *
       * Digital Twin
       *   - health profile
       *   - medical information
       *   - dietary experiences
       *
       * Food Genome
       *   - liked/loved foods
       *   - disliked foods
       *   - previous reactions
       *   - food history
       *
       * Example:
       *
       * Pizza
       *   Preference: liked
       *   Previous reaction:
       *   acidity + bloating
       *
       * Gemini receives this context before
       * generating the new food analysis.
       */

      const analysisResponse =
        await fetch(
          `${API_URL}/personalized-analysis`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              patient:
                patientData,

              food:
                recognitionData,

              nutrition:
                nutritionData,
            }),
          }
        );

      const analysisData =
        await analysisResponse.json();

      if (
        !analysisResponse.ok
      ) {
        setMessage(
          analysisData.message ||
            "Could not generate personalized analysis."
        );

        return;
      }

      setAnalysis(
        analysisData.analysis
      );

      setMessage(
        "Personalized food analysis completed successfully."
      );
    } catch (error) {
      console.error(
        "Food analysis error:",
        error
      );

      setMessage(
        "Could not connect to the food intelligence service."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // CONTINUE TO SHARED USER FEEDBACK
  // ==================================================

  function handleContinueToFeedback() {
    if (
      !foodResult?.foodName
    ) {
      return;
    }

    if (onFoodUploaded) {
      onFoodUploaded({
        foodName:
          foodResult.foodName,

        recognitionScore:
          foodResult.score ??
          null,

        nutrition,
      });
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="food-page">

      <div className="food-card">

        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="food-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        {/* ==================================================
            HEADER
        ================================================== */}

        <p className="section-label">
          FOOD INTELLIGENCE
        </p>

        <h1>
          Can I Eat This?
        </h1>

        <p className="food-subtitle">
          Upload a photo of the food you are
          about to eat. The system identifies
          the food, retrieves its nutrition
          information, and analyzes it using
          your Digital Twin and Food Genome.
        </p>

        {/* ==================================================
            PROCESS INDICATOR
        ================================================== */}

        <div className="food-process">

          <span>
            Upload
          </span>

          <span>
            →
          </span>

          <span>
            Recognize
          </span>

          <span>
            →
          </span>

          <span>
            Nutrition
          </span>

          <span>
            →
          </span>

          <span>
            Analyze
          </span>

          <span>
            →
          </span>

          <span>
            Feedback
          </span>

        </div>

        {/* ==================================================
            UPLOAD FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
        >

          <label className="food-upload-area">

            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={
                handleFileChange
              }
              disabled={loading}
            />

            <div className="food-upload-icon">
              ↑
            </div>

            <h3>
              Upload Food Image
            </h3>

            <p>
              Click to select a clear photo
              of your food.
            </p>

            <span>
              JPG, JPEG or PNG
            </span>

          </label>

          {/* ==================================================
              SELECTED FILE
          ================================================== */}

          {file && (
            <div className="food-selected-file">

              <span>
                Selected image:
              </span>

              <strong>
                {file.name}
              </strong>

            </div>
          )}

          {/* ==================================================
              ANALYZE BUTTON
          ================================================== */}

          <button
            type="submit"
            className="food-button"
            disabled={loading}
          >
            {loading
              ? "Analyzing Food..."
              : "Analyze Food →"}
          </button>

        </form>

        {/* ==================================================
            STATUS
        ================================================== */}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

        {/* ==================================================
            STEP 1 — FOOD RECOGNITION
        ================================================== */}

        {foodResult && (
          <div className="food-result">

            <p className="section-label">
              FOOD RECOGNITION
            </p>

            <h2>
              Identified Food
            </h2>

            <p>
              <strong>
                Food:
              </strong>{" "}
              {foodResult.foodName}
            </p>

            {typeof foodResult.score ===
              "number" && (
              <p>
                <strong>
                  Recognition Score:
                </strong>{" "}
                {(
                  foodResult.score *
                  100
                ).toFixed(2)}
                %
              </p>
            )}

          </div>
        )}

        {/* ==================================================
            STEP 2 — USDA NUTRITION
        ================================================== */}

        {nutrition && (
          <div className="nutrition-result">

            <p className="section-label">
              NUTRITION
            </p>

            <h2>
              Nutrition Information
            </h2>

            <p>
              <strong>
                Food:
              </strong>{" "}
              {nutrition.foodName}
            </p>

            <div className="nutrition-grid">

              <div>
                <strong>
                  Calories
                </strong>

                <span>
                  {nutrition.calories ??
                    "N/A"}
                </span>
              </div>

              <div>
                <strong>
                  Protein
                </strong>

                <span>
                  {nutrition.protein ??
                    "N/A"}{" "}
                  g
                </span>
              </div>

              <div>
                <strong>
                  Carbohydrates
                </strong>

                <span>
                  {nutrition.carbohydrates ??
                    "N/A"}{" "}
                  g
                </span>
              </div>

              <div>
                <strong>
                  Fat
                </strong>

                <span>
                  {nutrition.fat ??
                    "N/A"}{" "}
                  g
                </span>
              </div>

              <div>
                <strong>
                  Fiber
                </strong>

                <span>
                  {nutrition.fiber ??
                    "N/A"}{" "}
                  g
                </span>
              </div>

            </div>

            <p className="nutrition-note">
              Nutrition values are based on
              the USDA food record returned
              for the identified food and its
              reported serving basis.
            </p>

          </div>
        )}

        {/* ==================================================
            STEP 3 — PERSONALIZED ANALYSIS
        ================================================== */}

        {analysis && (
          <div className="food-result">

            <p className="section-label">
              PERSONALIZED ANALYSIS
            </p>

            <h2>
              Your Food Suitability
            </h2>

            <div className="ai-analysis-content">

              <ReactMarkdown>
                {analysis}
              </ReactMarkdown>

            </div>

            {/* ==================================================
                SHARED USER FEEDBACK
            ================================================== */}

            <div className="food-feedback-next">

              <p className="section-label">
                NEXT STEP
              </p>

              <h3>
                Tell Your Food Genome
              </h3>

              <p className="food-subtitle">
                After eating this food, record
                how you felt. Your preference and
                physical reaction are stored
                separately so future decisions
                become more personalized.
              </p>

              <button
                type="button"
                className="food-button"
                onClick={
                  handleContinueToFeedback
                }
              >
                Continue to Feedback →
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default FoodUpload;