import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function MedicalReport({
  patientData,
  onReportUploaded,
}) {
  const [file, setFile] =
    useState(null);

  const [message, setMessage] =
    useState("");

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
  }

  // ==================================================
  // UPLOAD MEDICAL REPORT
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setMessage(
        "Please select a medical report first."
      );
      return;
    }

    /*
     * Authentication is handled by the
     * HTTP-only session cookie.
     *
     * The backend identifies the user from
     * the authenticated session.
     */

    if (!patientData?.userId) {
      setMessage(
        "Your account session could not be found. Please log in again."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    const formData =
      new FormData();

    formData.append(
      "medicalReport",
      file
    );

    try {
      const response =
        await fetch(
          `${API_URL}/medical-reports`,
          {
            method: "POST",

            /*
             * Send the HTTP-only session
             * cookie with the request.
             */
            credentials:
              "include",

            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not upload the medical report."
        );

        return;
      }

      setMessage(
        data.message ||
          "Medical report uploaded successfully!"
      );

      setTimeout(() => {
        if (onReportUploaded) {
          onReportUploaded();
        }
      }, 800);
    } catch (error) {
      console.error(
        "Medical report upload error:",
        error
      );

      setMessage(
        "Could not connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // SKIP MEDICAL REPORT
  // ==================================================

  function handleSkip() {
    if (loading) {
      return;
    }

    setMessage("");

    if (onReportUploaded) {
      onReportUploaded();
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="medical-page">

      <div className="medical-card">

        {/* =========================
            LOGO
        ========================= */}

        <div className="medical-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        {/* =========================
            HEADING
        ========================= */}

        <p className="section-label">
          MEDICAL INFORMATION
        </p>

        <h1>
          Upload Your Medical Report
        </h1>

        <p className="medical-subtitle">
          Upload a medical report so the
          system can extract useful health
          information and improve your
          personalized dietary intelligence.
        </p>

        {/* =========================
            UPLOAD FORM
        ========================= */}

        <form
          onSubmit={handleSubmit}
        >

          <label className="upload-area">

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={
                handleFileChange
              }
              disabled={loading}
            />

            <div className="upload-icon">
              ↑
            </div>

            <h3>
              Upload Medical Report
            </h3>

            <p>
              Click to select a PDF or image
              of your medical report.
            </p>

            <span>
              PDF, JPG, JPEG or PNG
            </span>

          </label>

          {/* =========================
              SELECTED FILE
          ========================= */}

          {file && (
            <div className="selected-file">

              <span>
                Selected file:
              </span>

              <strong>
                {file.name}
              </strong>

            </div>
          )}

          {/* =========================
              SUBMIT
          ========================= */}

          <button
            type="submit"
            className="medical-button"
            disabled={loading}
          >
            {loading
              ? "Uploading Report..."
              : "Continue with Report →"}
          </button>

        </form>

        {/* =========================
            SKIP
        ========================= */}

        <button
          type="button"
          className="medical-skip-button"
          onClick={
            handleSkip
          }
          disabled={loading}
        >
          Skip for now →
        </button>

        <p className="medical-skip-note">
          You can continue using the system
          without uploading a medical report.
          Your health profile will still be
          used for personalization.
        </p>

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

export default MedicalReport;