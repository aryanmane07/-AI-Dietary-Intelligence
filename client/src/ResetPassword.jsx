import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5001";

function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ==================================================
  // RESET PASSWORD
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (
      !password ||
      !confirmPassword
    ) {
      setMessage(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (password.length < 8) {
      setMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setMessage(
        "Passwords do not match."
      );
      return;
    }

    // ==================================================
    // GET RESET TOKEN
    // ==================================================

    const params =
      new URLSearchParams(
        window.location.search
      );

    const token =
      params.get("token");

    if (!token) {
      setMessage(
        "This password reset link is invalid or missing."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/reset-password`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              token,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Could not reset your password."
        );

        return;
      }

      setSuccess(true);

      setMessage(
        data.message ||
          "Password reset successfully. You can now log in with your new password."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      setMessage(
        "Cannot connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // BACK TO LOGIN
  // ==================================================

  function handleBackToLogin() {
    if (onBackToLogin) {
      onBackToLogin();
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="login-page">

      <div className="login-card">

        {/* =========================
            LOGO
        ========================= */}

        <div className="login-logo">

          <span className="logo-icon">
            AI
          </span>

          <span>
            Dietary Intelligence
          </span>

        </div>

        {/* =========================
            TITLE
        ========================= */}

        <h1>
          Reset Password
        </h1>

        {/* =========================
            SUBTITLE
        ========================= */}

        <p className="login-subtitle">
          Create a new password for your
          Dietary Intelligence account.
        </p>

        {/* =========================
            RESET FORM
        ========================= */}

        {!success ? (

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* NEW PASSWORD */}

            <div className="login-field">

              <label>
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
                disabled={loading}
                required
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="login-field">

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                placeholder="Confirm your new password"
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                autoComplete="new-password"
                disabled={loading}
                required
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </form>

        ) : (

          <button
            type="button"
            className="login-button"
            onClick={
              handleBackToLogin
            }
          >
            Back to Login
          </button>

        )}

        {/* =========================
            MESSAGE
        ========================= */}

        {message && (

          <p className="profile-message">
            {message}
          </p>

        )}

        {/* =========================
            BACK TO LOGIN
        ========================= */}

        {!success && (

          <p className="register-text">

            Remember your password?{" "}

            <button
              type="button"
              className="login-link-button"
              onClick={
                handleBackToLogin
              }
              disabled={loading}
            >
              Login
            </button>

          </p>

        )}

      </div>

    </div>
  );
}

export default ResetPassword;