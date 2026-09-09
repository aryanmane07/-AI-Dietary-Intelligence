import { useState } from "react";

function PatientProfile({ onProfileSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    bloodPressure: "",
    bloodSugar: "",
    diseases: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          onProfileSaved();
        }, 800);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Could not save profile.");
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-logo">
          <span className="logo-icon">AI</span>
          <span>Dietary Intelligence</span>
        </div>

        <h1>Create Your Health Profile</h1>

        <p className="profile-subtitle">
          Enter your health information to create your personalized
          dietary profile.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-row">
            <div className="profile-field">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-field">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="Height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>

            <div className="profile-field">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="Weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-field">
              <label>Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                placeholder="e.g. 120/80"
                value={formData.bloodPressure}
                onChange={handleChange}
              />
            </div>

            <div className="profile-field">
              <label>Blood Sugar</label>
              <input
                type="text"
                name="bloodSugar"
                placeholder="e.g. 100 mg/dL"
                value={formData.bloodSugar}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>Diseases / Health Conditions</label>
            <textarea
              name="diseases"
              placeholder="e.g. Diabetes, Hypertension, None"
              value={formData.diseases}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="profile-button">
            Save Health Profile →
          </button>
        </form>

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}

export default PatientProfile;