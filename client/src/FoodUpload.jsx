import { useState } from "react";

function FoodUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0]);
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a food image first.");
      return;
    }

    const formData = new FormData();
    formData.append("foodImage", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/food-images",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Could not upload the food image.");
    }
  }

  return (
    <div className="food-page">
      <div className="food-card">
        <div className="food-logo">
          <span className="logo-icon">AI</span>
          <span>Dietary Intelligence</span>
        </div>

        <p className="section-label">FOOD INTELLIGENCE</p>

        <h1>Can I Eat This?</h1>

        <p className="food-subtitle">
          Upload a photo of the food you are about to eat. The
          system will identify the food and analyze its suitability
          based on your personalized health profile.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="food-upload-area">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            <div className="food-upload-icon">↑</div>

            <h3>Upload Food Image</h3>

            <p>
              Click to select a clear photo of your food.
            </p>

            <span>JPG, JPEG or PNG</span>
          </label>

          {file && (
            <div className="food-selected-file">
              <span>Selected image:</span>
              <strong>{file.name}</strong>
            </div>
          )}

          <button type="submit" className="food-button">
            Analyze Food →
          </button>
        </form>

        {message && (
          <p className="profile-message">{message}</p>
        )}
      </div>
    </div>
  );
}

export default FoodUpload;