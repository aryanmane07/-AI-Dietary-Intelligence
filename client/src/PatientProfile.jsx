import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function PatientProfile({
  patientData,
  onProfileSaved,
}) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodPressure: "",
    bloodSugar: "",
    diseases: "",
    allergies: "",
    foodPreferences: "",
  });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingProfile, setCheckingProfile] =
    useState(true);

  // ==================================================
  // LOAD EXISTING PROFILE
  // ==================================================

  useEffect(() => {
    async function loadExistingProfile() {
      const userId =
        patientData?.userId;

      if (!userId) {
        setMessage(
          "Your account session could not be found. Please log in again."
        );

        setCheckingProfile(false);
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/patients/user/${encodeURIComponent(
              userId
            )}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

        if (response.ok) {
          const data =
            await response.json();

          // --------------------------------------------
          // EXISTING PROFILE FOUND
          // --------------------------------------------

          setFormData({
            name:
              data.name || "",

            age:
              data.age || "",

            gender:
              data.gender || "",

            height:
              data.height || "",

            weight:
              data.weight || "",

            bloodPressure:
              data.bloodPressure || "",

            bloodSugar:
              data.bloodSugar || "",

            diseases:
              data.diseases || "",

            allergies:
              data.allergies || "",

            foodPreferences:
              data.foodPreferences || "",
          });

          setMessage(
            "Your existing health profile has been loaded."
          );
        } else if (
          response.status === 404
        ) {
          // --------------------------------------------
          // NO PROFILE YET
          // --------------------------------------------

          setMessage("");
        } else if (
          response.status === 401
        ) {
          setMessage(
            "Your session has expired. Please log in again."
          );
        } else {
          setMessage(
            "Could not check your existing health profile."
          );
        }
      } catch (error) {
        console.error(
          "Profile loading error:",
          error
        );

        setMessage(
          "Could not connect to the backend server."
        );
      } finally {
        setCheckingProfile(false);
      }
    }

    loadExistingProfile();
  }, [patientData?.userId]);

  // ==================================================
  // FORM CHANGE
  // ==================================================

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  }

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    const userId =
      patientData?.userId;

    if (!userId) {
      setMessage(
        "Your account session could not be found. Please log in again."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `${API_URL}/patients`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              ...formData,
              userId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not save your health profile."
        );

        return;
      }

      // ----------------------------------------------
      // PROFILE SAVED
      // ----------------------------------------------

      const savedProfile = {
        ...formData,

        userId,

        email:
          patientData?.email ||
          "",
      };

      setMessage(
        "Health profile saved successfully!"
      );

      setTimeout(() => {
        if (onProfileSaved) {
          onProfileSaved(
            savedProfile
          );
        }
      }, 500);
    } catch (error) {
      console.error(
        "Profile save error:",
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
  // LOADING EXISTING PROFILE
  // ==================================================

  if (checkingProfile) {
    return (
      <div className="profile-page">

        <div className="profile-card">

          <div className="profile-logo">

            <span className="logo-icon">
              AI
            </span>

            <span>
              Dietary Intelligence
            </span>

          </div>

          <div className="app-loading-card">

            <h2>
              Loading Your Health Profile
            </h2>

            <p>
              Checking your saved health
              information...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // PROFILE FORM
  // ==================================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        <h1>
          Create Your Health Profile
        </h1>

        <p className="profile-subtitle">
          Enter your health information to
          create your personalized dietary
          profile.
        </p>

        <form
          onSubmit={handleSubmit}
        >

          {/* =========================
              NAME
          ========================= */}

          <div className="profile-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              required
              disabled={loading}
            />

          </div>

          {/* =========================
              BASIC HEALTH DATA
          ========================= */}

          <div className="profile-row">

            <div className="profile-field">

              <label>
                Age
              </label>

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={
                  formData.age
                }
                onChange={
                  handleChange
                }
                min="1"
                max="120"
                required
                disabled={loading}
              />

            </div>

            <div className="profile-field">

              <label>
                Gender
              </label>

              <select
                name="gender"
                value={
                  formData.gender
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>
              </select>

            </div>

            <div className="profile-field">

              <label>
                Height (cm)
              </label>

              <input
                type="number"
                name="height"
                placeholder="Height"
                value={
                  formData.height
                }
                onChange={
                  handleChange
                }
                min="1"
                required
                disabled={loading}
              />

            </div>

          </div>

          <div className="profile-row">

            <div className="profile-field">

              <label>
                Weight (kg)
              </label>

              <input
                type="number"
                name="weight"
                placeholder="Weight"
                value={
                  formData.weight
                }
                onChange={
                  handleChange
                }
                min="1"
                required
                disabled={loading}
              />

            </div>

          </div>

          {/* =========================
              HEALTH METRICS
          ========================= */}

          <div className="profile-row">

            <div className="profile-field">

              <label>
                Blood Pressure
              </label>

              <input
                type="text"
                name="bloodPressure"
                placeholder="e.g. 120/80"
                value={
                  formData.bloodPressure
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

            <div className="profile-field">

              <label>
                Blood Sugar
              </label>

              <input
                type="text"
                name="bloodSugar"
                placeholder="e.g. 100 mg/dL"
                value={
                  formData.bloodSugar
                }
                onChange={
                  handleChange
                }
                disabled={loading}
              />

            </div>

          </div>

          {/* =========================
              DISEASES / CONDITIONS
          ========================= */}

          <div className="profile-field">

            <label>
              Diseases / Health Conditions
            </label>

            <textarea
              name="diseases"
              placeholder="e.g. Diabetes, Hypertension, None"
              value={
                formData.diseases
              }
              onChange={
                handleChange
              }
              rows="4"
              disabled={loading}
            ></textarea>

          </div>

          {/* =========================
              ALLERGIES
          ========================= */}

          <div className="profile-field">

            <label>
              Allergies
            </label>

            <textarea
              name="allergies"
              placeholder="e.g. Peanuts, shellfish, milk, None"
              value={
                formData.allergies
              }
              onChange={
                handleChange
              }
              rows="3"
              disabled={loading}
            ></textarea>

          </div>

          {/* =========================
              FOOD PREFERENCES
          ========================= */}

          <div className="profile-field">

            <label>
              Food Preferences
            </label>

            <textarea
              name="foodPreferences"
              placeholder="e.g. Vegetarian, vegan, spicy food, low-sugar meals"
              value={
                formData.foodPreferences
              }
              onChange={
                handleChange
              }
              rows="3"
              disabled={loading}
            ></textarea>

          </div>

          {/* =========================
              SAVE
          ========================= */}

          <button
            type="submit"
            className="profile-button"
            disabled={loading}
          >
            {loading
              ? "Saving Profile..."
              : "Save Health Profile →"}
          </button>

        </form>

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

export default PatientProfile;