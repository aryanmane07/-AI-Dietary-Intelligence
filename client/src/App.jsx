import { useState } from "react";
import Login from "./Login";
import PatientProfile from "./PatientProfile";
import MedicalReport from "./MedicalReport";
import FoodUpload from "./FoodUpload";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMedicalReport, setShowMedicalReport] = useState(false);
  const [showFoodUpload, setShowFoodUpload] = useState(false);

  if (showLogin) {
    return (
      <Login
        onLoginSuccess={() => {
          setShowLogin(false);
          setShowProfile(true);
        }}
      />
    );
  }

  if (showProfile) {
    return (
      <PatientProfile
        onProfileSaved={() => {
          setShowProfile(false);
          setShowMedicalReport(true);
        }}
      />
    );
  }

  if (showMedicalReport) {
    return (
      <MedicalReport
        onReportUploaded={() => {
          setShowMedicalReport(false);
          setShowFoodUpload(true);
        }}
      />
    );
  }
  
  if (showFoodUpload) {
    return <FoodUpload />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">AI</span>
          <span>Dietary Intelligence</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>

          <button
            className="nav-button"
            onClick={() => setShowLogin(true)}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-badge">
              AI-POWERED PERSONALIZED NUTRITION
            </p>

            <h1>
              Your Health.
              <br />
              Your Food.
              <br />
              <span>One Intelligent System.</span>
            </h1>

            <p className="hero-description">
              AI Dietary Intelligence combines your health profile,
              medical information, food data, and personal history to
              help you make smarter food decisions.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => setShowLogin(true)}
              >
                Get Started →
              </button>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="health-card">
              <div className="card-header">
                <div>
                  <p className="small-label">PATIENT PROFILE</p>
                  <h3>Health Overview</h3>
                </div>

                <span className="status-dot"></span>
              </div>

              <div className="health-stats">
                <div>
                  <span>Age</span>
                  <strong>--</strong>
                </div>

                <div>
                  <span>Weight</span>
                  <strong>-- kg</strong>
                </div>

                <div>
                  <span>Blood Sugar</span>
                  <strong>--</strong>
                </div>

                <div>
                  <span>Blood Pressure</span>
                  <strong>--</strong>
                </div>
              </div>

              <div className="ai-insight">
                <div className="insight-icon">✦</div>

                <div>
                  <p>AI INSIGHT</p>

                  <span>
                    Your personalized dietary intelligence will
                    appear here.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <p className="section-label">CORE INTELLIGENCE</p>

            <h2>
              More Than Nutrition.
              <br />
              <span>Personalized Intelligence.</span>
            </h2>

            <p>
              The system learns from your health, food choices, and
              feedback to build a continuously improving
              understanding of what works for you.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-number">01</div>

              <h3>Digital Twin</h3>

              <p>
                A personalized virtual representation of your health
                profile that evolves as new health and lifestyle data
                is added.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">02</div>

              <h3>Food Genome</h3>

              <p>
                Learns your food preferences, history, suitability
                patterns, and reactions to build a personalized food
                knowledge profile.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-number">03</div>

              <h3>AI Food Analysis</h3>

              <p>
                Upload a food image and receive a personalized
                analysis based on the identified food and your
                individual health profile.
              </p>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <p className="section-label">HOW IT WORKS</p>

            <h2>
              From Health Data to
              <br />
              <span>Smarter Food Decisions.</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span>01</span>

              <h3>Understand</h3>

              <p>
                Build a health profile using personal information and
                medical data.
              </p>
            </div>

            <div className="step-card">
              <span>02</span>

              <h3>Analyze</h3>

              <p>
                Understand food through image analysis and
                nutritional information.
              </p>
            </div>

            <div className="step-card">
              <span>03</span>

              <h3>Learn</h3>

              <p>
                Learn from food history, preferences, and user
                feedback.
              </p>
            </div>

            <div className="step-card">
              <span>04</span>

              <h3>Personalize</h3>

              <p>
                Provide increasingly personalized food insights and
                recommendations.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-heading">
            <p className="section-label">ABOUT THE PROJECT</p>

            <h2>
              Personalized Intelligence for Better Food Decisions
            </h2>

            <p>
              AI Dietary Intelligence combines health information,
              medical reports, food data, and user feedback to create
              a personalized understanding of dietary suitability.
            </p>
          </div>

          <div className="about-content">
            <div className="about-card">
              <h3>Why We Built It</h3>

              <p>
                Traditional diet applications often provide generic
                nutrition recommendations. Our system aims to
                understand the individual and personalize food-related
                insights around their health profile and history.
              </p>
            </div>

            <div className="about-card">
              <h3>What Makes It Different</h3>

              <p>
                The platform combines multimodal health data, food
                image analysis, a Digital Twin, a personalized Food
                Genome, and adaptive AI recommendations in one
                system.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">AI</span>
              <span>Dietary Intelligence</span>
            </div>

            <p>
              AI-driven personalized dietary intelligence for
              smarter, more informed food decisions.
            </p>
          </div>

          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Final Year Project • B.Tech Computer Science</span>

          <span>© 2026 Dietary Intelligence</span>
        </div>
      </footer>
    </div>
  );
}

export default App;