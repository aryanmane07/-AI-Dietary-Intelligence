function Dashboard({
  patientData,
  onCanIEat,
  onWhatShouldIEat,
  onDigitalTwin,
  onFoodGenome,
  onHome,
  onLogout,
}) {
  const dashboardOptions = [
    {
      number: "01",
      label: "FOOD SUITABILITY",
      title: "Can I Eat This?",
      description:
        "Upload a photo of food you are about to eat and get a personalized analysis based on your health profile and Food Genome.",
      action: "Analyze Food →",
      onClick: onCanIEat,
    },

    {
      number: "02",
      label: "PERSONALIZED MEALS",
      title: "What Should I Eat?",
      description:
        "Tell the AI your goal or context and receive a meal plan personalized around your health, preferences, and previous experiences.",
      action: "Create Meal Plan →",
      onClick: onWhatShouldIEat,
    },

    {
      number: "03",
      label: "HEALTH INTELLIGENCE",
      title: "Digital Twin",
      description:
        "View your personalized health representation built from your profile and medical information to support intelligent dietary decisions.",
      action: "View Digital Twin →",
      onClick: onDigitalTwin,
    },

    {
      number: "04",
      label: "FOOD INTELLIGENCE",
      title: "Food Genome",
      description:
        "Explore your food preferences, experiences, reactions, and patterns learned from your interactions and feedback.",
      action: "View Food Genome →",
      onClick: onFoodGenome,
    },
  ];

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        {/* ==================================================
            DASHBOARD HEADER
        ================================================== */}

        <div className="dashboard-top">

          <div>

            <p className="section-label">
              PERSONALIZED DASHBOARD
            </p>

            <h1>
              Welcome{" "}
              <span>
                {patientData?.name ||
                  "Patient"}
              </span>
            </h1>

            <p className="dashboard-subtitle">
              Your personalized dietary
              intelligence is ready. Choose what
              you would like to explore.
            </p>

          </div>

          <div className="dashboard-header-actions">

            <button
              type="button"
              className="dashboard-home-button"
              onClick={onHome}
            >
              ← Home
            </button>

            <button
              type="button"
              className="dashboard-logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

            <div className="dashboard-status">

              <span className="status-dot"></span>

              AI Profile Active

            </div>

          </div>

        </div>

        {/* ==================================================
            MAIN DASHBOARD OPTIONS
        ================================================== */}

        <div className="dashboard-options">

          {dashboardOptions.map(
            (option) => (
              <button
                key={option.number}
                type="button"
                className="dashboard-option"
                onClick={option.onClick}
              >

                <div className="dashboard-option-number">
                  {option.number}
                </div>

                <div className="dashboard-option-content">

                  <p className="dashboard-option-label">
                    {option.label}
                  </p>

                  <h2>
                    {option.title}
                  </h2>

                  <p>
                    {option.description}
                  </p>

                  <span className="dashboard-option-link">
                    {option.action}
                  </span>

                </div>

              </button>
            )
          )}

        </div>

        {/* ==================================================
            INTELLIGENCE OVERVIEW
        ================================================== */}

        <div className="dashboard-intelligence">

          <div className="dashboard-intelligence-header">

            <div>

              <p className="section-label">
                YOUR INTELLIGENCE
              </p>

              <h2>
                Health & Food Intelligence
              </h2>

            </div>

            <div className="dashboard-ai-icon">
              AI
            </div>

          </div>

          <div className="dashboard-intelligence-grid">

            <div>

              <span>
                Digital Twin
              </span>

              <strong>
                Active
              </strong>

              <p>
                Your health model supports
                personalized dietary analysis
                and recommendations.
              </p>

            </div>

            <div>

              <span>
                Food Genome
              </span>

              <strong>
                Learning
              </strong>

              <p>
                Your preferences, food
                experiences, and reactions become
                more personalized through feedback.
              </p>

            </div>

            <div>

              <span>
                AI Personalization
              </span>

              <strong>
                Active
              </strong>

              <p>
                Your Digital Twin and Food Genome
                work together to personalize food
                decisions and meal plans.
              </p>

            </div>

          </div>

        </div>

        {/* ==================================================
            CONTINUOUS LEARNING
        ================================================== */}

        <div className="dashboard-learning">

          <div className="dashboard-learning-icon">
            AI
          </div>

          <div>

            <strong>
              Your system keeps learning
            </strong>

            <p>
              Every food experience and feedback
              can refine your Food Genome and
              improve future personalized
              recommendations.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;