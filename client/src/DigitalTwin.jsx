import { useEffect, useState } from "react";
import "./digitaltwin.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function DigitalTwin({
  patientData,
  onContinue,
  onMedicalReport,
}) {
  const [digitalTwin, setDigitalTwin] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  // ==================================================
  // LOAD DIGITAL TWIN
  // ==================================================

  useEffect(() => {
    async function loadDigitalTwin() {
      const userId =
        patientData?.userId;

      if (!userId) {
        setLoading(false);

        setMessage(
          "No user account was found. Please log in again."
        );

        return;
      }

      setLoading(true);
      setMessage("");

      try {
        const response =
          await fetch(
            `${API_URL}/digital-twin/user/${encodeURIComponent(
              userId
            )}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Could not load Digital Twin data."
          );

          return;
        }

        setDigitalTwin(data);
      } catch (error) {
        console.error(
          "Digital Twin loading error:",
          error
        );

        setMessage(
          "Could not connect to the Digital Twin service."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDigitalTwin();
  }, [patientData?.userId]);

  // ==================================================
  // DIGITAL TWIN DATA
  // ==================================================

  const healthProfile =
    digitalTwin?.healthProfile ||
    patientData ||
    {};

  const feedbackCount =
    digitalTwin?.feedbackCount || 0;

  const latestFeedback =
    digitalTwin?.lastDietaryFeedback ||
    null;

  const medicalReportData =
    digitalTwin?.medicalReportData ||
    patientData?.medicalReportData ||
    null;

  const medicalReportAnalyzed =
    Boolean(
      digitalTwin?.medicalReportAnalyzed
    );

  // ==================================================
  // RENDER LIST
  // ==================================================

  function renderList(items) {
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return null;
    }

    return (
      <ul className="twin-report-list">

        {items.map(
          (item, index) => (
            <li key={index}>
              {typeof item === "object"
                ? Object.entries(item)
                    .map(
                      ([key, value]) =>
                        `${key}: ${value}`
                    )
                    .join(" • ")
                : String(item)}
            </li>
          )
        )}

      </ul>
    );
  }

  // ==================================================
  // MEDICAL MEASUREMENTS
  // ==================================================

  const measurements = [
    {
      label: "Blood Pressure",
      value:
        medicalReportData?.bloodPressure,
    },
    {
      label: "Blood Sugar",
      value:
        medicalReportData?.bloodSugar,
    },
    {
      label: "Fasting Blood Sugar",
      value:
        medicalReportData?.fastingBloodSugar,
    },
    {
      label: "Post-Meal Blood Sugar",
      value:
        medicalReportData?.postMealBloodSugar,
    },
    {
      label: "HbA1c",
      value:
        medicalReportData?.hba1c,
    },
    {
      label: "Total Cholesterol",
      value:
        medicalReportData?.cholesterol,
    },
    {
      label: "LDL",
      value:
        medicalReportData?.ldl,
    },
    {
      label: "HDL",
      value:
        medicalReportData?.hdl,
    },
    {
      label: "Triglycerides",
      value:
        medicalReportData?.triglycerides,
    },
    {
      label: "Hemoglobin",
      value:
        medicalReportData?.hemoglobin,
    },
  ].filter(
    (item) =>
      item.value !== null &&
      item.value !== undefined &&
      item.value !== ""
  );

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="digital-twin-page">

      <div className="digital-twin-card">

        {/* =========================
            BRAND
        ========================= */}

        <div className="digital-twin-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        {/* =========================
            PAGE HEADER
        ========================= */}

        <p className="section-label">
          PERSONALIZED HEALTH MODEL
        </p>

        <h1>
          Your Digital Twin
        </h1>

        <p className="digital-twin-subtitle">
          A structured representation of your
          health profile, medical information,
          dietary experiences, and learned
          patterns used to personalize food
          decisions over time.
        </p>

        {/* =========================
            PATIENT STATUS
        ========================= */}

        <div className="digital-twin-header">

          <div>

            <span className="small-label">
              PATIENT
            </span>

            <h2>
              {patientData?.name ||
                healthProfile?.name ||
                "Patient"}
            </h2>

          </div>

          <div className="twin-status">

            <span className="status-dot"></span>

            Digital Twin Active

          </div>

        </div>

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="twin-ai-insight">

            <div className="insight-icon">
              AI
            </div>

            <div>

              <p>
                LOADING DIGITAL TWIN
              </p>

              <span>
                Retrieving your personalized
                health model...
              </span>

            </div>

          </div>
        )}

        {/* =========================
            CONTENT
        ========================= */}

        {!loading && (
          <>

            {/* =========================
                01 — HEALTH PROFILE
            ========================= */}

            <section className="twin-section">

              <div className="twin-section-header">

                <div>

                  <p className="section-label">
                    HEALTH PROFILE
                  </p>

                  <h2>
                    Your Health Snapshot
                  </h2>

                  <p className="digital-twin-subtitle">
                    The core health information
                    used by your personalized
                    dietary intelligence system.
                  </p>

                </div>

              </div>

              <div className="twin-stats">

                <div className="twin-stat">

                  <span>
                    Age
                  </span>

                  <strong>
                    {healthProfile?.age ||
                      "--"}
                  </strong>

                </div>

                <div className="twin-stat">

                  <span>
                    Height
                  </span>

                  <strong>
                    {healthProfile?.height
                      ? `${healthProfile.height} cm`
                      : "--"}
                  </strong>

                </div>

                <div className="twin-stat">

                  <span>
                    Weight
                  </span>

                  <strong>
                    {healthProfile?.weight
                      ? `${healthProfile.weight} kg`
                      : "--"}
                  </strong>

                </div>

                <div className="twin-stat">

                  <span>
                    Blood Pressure
                  </span>

                  <strong>
                    {healthProfile?.bloodPressure ||
                      "--"}
                  </strong>

                </div>

                <div className="twin-stat">

                  <span>
                    Blood Sugar
                  </span>

                  <strong>
                    {healthProfile?.bloodSugar ||
                      "--"}
                  </strong>

                </div>

                <div className="twin-stat">

                  <span>
                    Feedback Learned
                  </span>

                  <strong>
                    {feedbackCount}
                  </strong>

                </div>

              </div>

              <div className="twin-condition">

                <span>
                  Health Conditions
                </span>

                <p>
                  {healthProfile?.diseases ||
                    "No conditions provided"}
                </p>

              </div>

            </section>

            {/* =========================
                02 — MEDICAL REPORT
            ========================= */}

            <section className="twin-section twin-medical-report">

              <div className="twin-medical-report-header">

                <div>

                  <p className="section-label">
                    MEDICAL INFORMATION
                  </p>

                  <h2>
                    Medical Report
                  </h2>

                  <p className="digital-twin-subtitle">
                    Medical reports are optional.
                    When provided, explicitly
                    reported information can be
                    incorporated into your Digital
                    Twin.
                  </p>

                </div>

                {medicalReportAnalyzed && (
                  <div className="twin-report-status">

                    <span className="status-dot"></span>

                    AI Analyzed

                  </div>
                )}

              </div>

              {/* =========================
                  NO REPORT
              ========================= */}

              {!medicalReportAnalyzed && (
                <div className="twin-report-empty">

                  <div className="twin-report-empty-icon">
                    MR
                  </div>

                  <div>

                    <h3>
                      No Medical Report Added
                    </h3>

                    <p>
                      You can upload a medical
                      report whenever you are ready.
                      The system can extract relevant
                      information and use it for
                      personalization.
                    </p>

                    <button
                      type="button"
                      className="digital-twin-report-button"
                      onClick={
                        onMedicalReport
                      }
                    >
                      Upload Medical Report →
                    </button>

                  </div>

                </div>
              )}

              {/* =========================
                  REPORT AVAILABLE
              ========================= */}

              {medicalReportAnalyzed &&
                medicalReportData && (
                  <div className="twin-report-content">

                    <div className="twin-report-success">

                      <span>
                        OK
                      </span>

                      <div>

                        <strong>
                          Medical Report Analyzed
                        </strong>

                        <p>
                          Relevant information from
                          your report has been added
                          to your Digital Twin.
                        </p>

                      </div>

                    </div>

                    {/* CONDITIONS */}

                    {medicalReportData.conditions?.length >
                      0 && (
                      <div className="twin-report-section">

                        <span>
                          Conditions
                        </span>

                        {renderList(
                          medicalReportData.conditions
                        )}

                      </div>
                    )}

                    {/* MEASUREMENTS */}

                    {measurements.length >
                      0 && (
                      <div className="twin-report-section">

                        <span>
                          Reported Measurements
                        </span>

                        <div className="twin-report-values">

                          {measurements.map(
                            (item) => (
                              <div
                                key={
                                  item.label
                                }
                              >

                                <small>
                                  {item.label}
                                </small>

                                <strong>
                                  {item.value}
                                </strong>

                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                    {/* THYROID */}

                    {medicalReportData
                      .thyroidResults
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Thyroid Results
                        </span>

                        {renderList(
                          medicalReportData
                            .thyroidResults
                        )}

                      </div>
                    )}

                    {/* KIDNEY */}

                    {medicalReportData
                      .kidneyFindings
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Kidney Findings
                        </span>

                        {renderList(
                          medicalReportData
                            .kidneyFindings
                        )}

                      </div>
                    )}

                    {/* LIVER */}

                    {medicalReportData
                      .liverFindings
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Liver Findings
                        </span>

                        {renderList(
                          medicalReportData
                            .liverFindings
                        )}

                      </div>
                    )}

                    {/* ALLERGIES */}

                    {medicalReportData
                      .allergies
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Allergies
                        </span>

                        {renderList(
                          medicalReportData
                            .allergies
                        )}

                      </div>
                    )}

                    {/* DIETARY RESTRICTIONS */}

                    {medicalReportData
                      .dietaryRestrictions
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Dietary Restrictions
                        </span>

                        {renderList(
                          medicalReportData
                            .dietaryRestrictions
                        )}

                      </div>
                    )}

                    {/* MEDICATIONS */}

                    {medicalReportData
                      .medications
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Medications
                        </span>

                        {renderList(
                          medicalReportData
                            .medications
                        )}

                      </div>
                    )}

                    {/* OTHER FINDINGS */}

                    {medicalReportData
                      .otherRelevantFindings
                      ?.length > 0 && (
                      <div className="twin-report-section">

                        <span>
                          Other Relevant Findings
                        </span>

                        {renderList(
                          medicalReportData
                            .otherRelevantFindings
                        )}

                      </div>
                    )}

                    {/* UPDATE REPORT */}

                    <button
                      type="button"
                      className="digital-twin-report-button"
                      onClick={
                        onMedicalReport
                      }
                    >
                      Update Medical Report →
                    </button>

                  </div>
                )}

            </section>

            {/* =========================
                03 — DIETARY LEARNING
            ========================= */}

            <section className="twin-section">

              <div className="twin-section-header">

                <div>

                  <p className="section-label">
                    DIETARY LEARNING
                  </p>

                  <h2>
                    What Your Twin Has Learned
                  </h2>

                  <p className="digital-twin-subtitle">
                    Food experiences and feedback
                    gradually help the system
                    understand your personal dietary
                    patterns.
                  </p>

                </div>

              </div>

              <div className="twin-learning-card">

                <div className="twin-learning-stat">

                  <span>
                    Feedback Records
                  </span>

                  <strong>
                    {feedbackCount}
                  </strong>

                </div>

                {latestFeedback ? (
                  <div className="twin-learning-detail">

                    <span>
                      Latest Dietary Experience
                    </span>

                    <h3>
                      {latestFeedback.foodName ||
                        "Food experience"}
                    </h3>

                    {latestFeedback.status && (
                      <p>
                        Status:{" "}
                        {latestFeedback.status}
                      </p>
                    )}

                    {latestFeedback.reaction && (
                      <p>
                        Reaction:{" "}
                        {latestFeedback.reaction}
                      </p>
                    )}

                    {latestFeedback.notes && (
                      <p>
                        Notes:{" "}
                        {latestFeedback.notes}
                      </p>
                    )}

                    <small>
                      Previous experiences can
                      influence future food analysis
                      and meal recommendations.
                    </small>

                  </div>
                ) : (
                  <div className="twin-learning-detail">

                    <span>
                      NO DIETARY LEARNING YET
                    </span>

                    <h3>
                      Your Digital Twin will learn
                      from your food experiences.
                    </h3>

                    <p>
                      Record preferences, reactions,
                      and experiences with foods to
                      help personalize future
                      recommendations.
                    </p>

                  </div>
                )}

              </div>

            </section>

            {/* =========================
                04 — AI HEALTH UNDERSTANDING
            ========================= */}

            <section className="twin-section">

              <div className="twin-ai-insight">

                <div className="insight-icon">
                  AI
                </div>

                <div>

                  <p>
                    AI HEALTH UNDERSTANDING
                  </p>

                  <span>
                    Your Digital Twin combines
                    your health profile, available
                    medical information, dietary
                    feedback, preferences, and
                    learned food experiences.
                    These signals support more
                    personalized food analysis and
                    meal recommendations.
                  </span>

                </div>

              </div>

            </section>

          </>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {message && (
          <p className="profile-message">
            {message}
          </p>
        )}

        {/* =========================
            CONTINUE
        ========================= */}

        <button
          type="button"
          className="digital-twin-button"
          onClick={onContinue}
          disabled={loading}
        >
          Continue to Food Genome →
        </button>

      </div>

    </div>
  );
}

export default DigitalTwin;