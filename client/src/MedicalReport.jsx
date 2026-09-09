import { useState } from "react";

function MedicalReport({ onReportUploaded }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a medical report first.");
      return;
    }

    const formData = new FormData();
    formData.append("medicalReport", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/medical-reports",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          onReportUploaded();
        }, 800);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Could not upload the medical report.");
    }
  }

  return (
    <div className="medical-page">
      <div className="medical-card">
        <div className="medical-logo">
          <span className="logo-icon">AI</span>
          <span>Dietary Intelligence</span>
        </div>

        <p className="section-label">MEDICAL INFORMATION</p>

        <h1>Upload Your Medical Report</h1>

        <p className="medical-subtitle">
          Upload a medical report so the system can extract useful
          health information and improve your personalized dietary
          intelligence.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="upload-area">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            <div className="upload-icon">↑</div>

            <h3>Upload Medical Report</h3>

            <p>
              Click to select a PDF or image of your medical report.
            </p>

            <span>PDF, JPG, JPEG or PNG</span>
          </label>

          {file && (
            <div className="selected-file">
              <span>Selected file:</span>
              <strong>{file.name}</strong>
            </div>
          )}

          <button type="submit" className="medical-button">
            Continue with Report →
          </button>
        </form>

        {message && (
          <p className="profile-message">{message}</p>
        )}
      </div>
    </div>
  );
}

export default MedicalReport;