import { useState, type FormEvent } from "react";
import "./App.css";

type Page =
  | "Dashboard"
  | "AI Inventory"
  | "Risk Assessments"
  | "Risk Register"
  | "Controls"
  | "Vendors"
  | "Remediation";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

type AISystem = {
  id: number;
  name: string;
  department: string;
  owner: string;
  vendor: string;
  dataSensitivity: string;
  criticality: string;
  risk: RiskLevel;
  status: string;
};

type AssessmentResult = {
  id: number;
  systemId: number;
  systemName: string;
  date: string;
  likelihood: number;
  impact: number;
  score: number;
  risk: RiskLevel;
  framework: {
    Govern: number;
    Map: number;
    Measure: number;
    Manage: number;
  };
};

type Question = {
  id: string;
  title: string;
  description: string;
  framework: "Govern" | "Map" | "Measure" | "Manage";
  dimension: "likelihood" | "impact";
};

const initialSystems: AISystem[] = [
  {
    id: 1,
    name: "RecruitAI",
    department: "Human Resources",
    owner: "Sarah K.",
    vendor: "HireSense AI",
    dataSensitivity: "Restricted",
    criticality: "High",
    risk: "Critical",
    status: "Review required",
  },
  {
    id: 2,
    name: "Finance Copilot",
    department: "Finance",
    owner: "Omar H.",
    vendor: "Microsoft",
    dataSensitivity: "Confidential",
    criticality: "High",
    risk: "High",
    status: "Monitored",
  },
  {
    id: 3,
    name: "CustomerAssist",
    department: "Customer Service",
    owner: "Lina M.",
    vendor: "OpenAI",
    dataSensitivity: "Internal",
    criticality: "Medium",
    risk: "High",
    status: "Remediation",
  },
  {
    id: 4,
    name: "ThreatLens AI",
    department: "Information Security",
    owner: "Karim A.",
    vendor: "Internal",
    dataSensitivity: "Restricted",
    criticality: "High",
    risk: "Medium",
    status: "Approved",
  },
  {
    id: 5,
    name: "LegalDraft AI",
    department: "Legal",
    owner: "Maya R.",
    vendor: "Anthropic",
    dataSensitivity: "Confidential",
    criticality: "High",
    risk: "Medium",
    status: "Assessment due",
  },
  {
    id: 6,
    name: "SalesPredict",
    department: "Sales",
    owner: "Jad N.",
    vendor: "Internal",
    dataSensitivity: "Internal",
    criticality: "Medium",
    risk: "Low",
    status: "Approved",
  },
  {
    id: 7,
    name: "Marketing Copilot",
    department: "Marketing",
    owner: "Victor A.",
    vendor: "OpenAI",
    dataSensitivity: "Confidential",
    criticality: "High",
    risk: "Medium",
    status: "Assessment due",
  },
];

const assessmentQuestions: Question[] = [
  {
    id: "sensitiveData",
    title: "Sensitive data exposure",
    description:
      "How much sensitive, confidential or restricted information does this AI system process?",
    framework: "Map",
    dimension: "impact",
  },
  {
    id: "businessCriticality",
    title: "Business criticality",
    description:
      "How significantly could failure of this AI system disrupt business operations?",
    framework: "Map",
    dimension: "impact",
  },
  {
    id: "regulatoryImpact",
    title: "Legal & regulatory exposure",
    description:
      "How significant could the legal, privacy, compliance or regulatory consequences be?",
    framework: "Govern",
    dimension: "impact",
  },
  {
    id: "affectedUsers",
    title: "People affected",
    description:
      "How many employees, customers or external stakeholders could be affected by incorrect AI decisions?",
    framework: "Govern",
    dimension: "impact",
  },
  {
    id: "humanOversight",
    title: "Human oversight gap",
    description:
      "How limited is meaningful human review before AI outputs influence decisions?",
    framework: "Manage",
    dimension: "likelihood",
  },
  {
    id: "vendorDependency",
    title: "Third-party dependency",
    description:
      "How dependent is the organization on an external AI vendor with limited control or visibility?",
    framework: "Govern",
    dimension: "likelihood",
  },
  {
    id: "cyberControls",
    title: "Cybersecurity control weakness",
    description:
      "How weak are authentication, access control, logging, monitoring or data protection controls?",
    framework: "Manage",
    dimension: "likelihood",
  },
  {
    id: "modelReliability",
    title: "Model reliability risk",
    description:
      "How likely are hallucinations, bias, inaccurate outputs or unpredictable model behavior?",
    framework: "Measure",
    dimension: "likelihood",
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>("Dashboard");
  const [systems, setSystems] = useState<AISystem[]>(initialSystems);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [showAddSystem, setShowAddSystem] = useState(false);

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-brand">
          <div className="brand-mark">A</div>
          <div>
            <h1>AegisAI</h1>
            <p>Enterprise AI Risk & Governance</p>
          </div>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">NOVABRIDGE GROUP</span>
            <h2>Welcome back</h2>
            <p>Sign in to access your AI governance workspace.</p>
          </div>

          <label>Work email</label>
          <input type="email" placeholder="victor@novabridge.com" />

          <label>Password</label>
          <input type="password" placeholder="••••••••••" />

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-button">Forgot password?</button>
          </div>

          <button
            className="primary-button"
            onClick={() => setLoggedIn(true)}
          >
            Sign in
          </button>

          <div className="security-note">
            <span>●</span>
            Protected enterprise workspace
          </div>
        </div>

        <p className="login-footer">
          AegisAI · AI governance designed for responsible innovation
        </p>
      </div>
    );
  }

  const pages: Page[] = [
    "Dashboard",
    "AI Inventory",
    "Risk Assessments",
    "Risk Register",
    "Controls",
    "Vendors",
    "Remediation",
  ];

  const highRiskSystems = systems.filter(
    (system) => system.risk === "High" || system.risk === "Critical"
  ).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">A</div>
          <div>
            <strong>AegisAI</strong>
            <span>Governance Platform</span>
          </div>
        </div>

        <div className="workspace">
          <span>WORKSPACE</span>
          <strong>NovaBridge Group</strong>
        </div>

        <nav>
          {pages.map((page) => (
            <button
              key={page}
              className={activePage === page ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(page)}
            >
              <span className="nav-dot" />
              {page}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="framework-card">
            <span>NIST AI RMF</span>
            <strong>Govern · Map · Measure · Manage</strong>
          </div>

          <button className="profile">
            <div className="avatar">VA</div>
            <div>
              <strong>Victor Abou Rjeily</strong>
              <span>Risk Analyst</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header>
          <div>
            <p className="breadcrumb">NovaBridge Group / {activePage}</p>
            <h1>{activePage}</h1>
            <p className="subtitle">
              Enterprise view of AI risk, governance and remediation.
            </p>
          </div>

          <div className="header-actions">
            {activePage === "AI Inventory" ? (
              <>
                <button className="secondary-button">
                  Export inventory
                </button>

                <button
                  className="primary-small"
                  onClick={() => setShowAddSystem(true)}
                >
                  + Add AI system
                </button>
              </>
            ) : activePage === "Risk Assessments" ? (
              <button className="secondary-button">
                Assessment methodology
              </button>
            ) : (
              <>
                <button className="secondary-button">Export report</button>
                <button
                  className="primary-small"
                  onClick={() => setActivePage("Risk Assessments")}
                >
                  + New assessment
                </button>
              </>
            )}
          </div>
        </header>

        {activePage === "Dashboard" ? (
          <>
            <section className="summary-grid">
              <Metric
                label="AI Systems"
                value={String(systems.length)}
                detail="Registered in inventory"
              />

              <Metric
                label="High-Risk Systems"
                value={String(highRiskSystems)}
                detail="Requires attention"
                alert
              />

              <Metric
                label="Assessments Completed"
                value={String(assessments.length)}
                detail="Current session"
              />

              <Metric
                label="Control Coverage"
                value="82%"
                detail="+7% since last review"
              />
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      ENTERPRISE EXPOSURE
                    </span>
                    <h2>AI Risk Overview</h2>
                  </div>

                  <button className="mini-button">
                    Last 90 days ▾
                  </button>
                </div>

                <div className="risk-score-area">
                  <div className="risk-score">
                    <span>Overall risk</span>
                    <strong>68</strong>
                    <small>/ 100</small>
                  </div>

                  <div className="risk-bars">
                    <RiskBar label="Critical" value={2} width={18} />
                    <RiskBar label="High" value={5} width={42} />
                    <RiskBar label="Medium" value={9} width={68} />
                    <RiskBar label="Low" value={8} width={58} />
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">FRAMEWORK</span>
                    <h2>NIST AI RMF</h2>
                  </div>
                </div>

                <FrameworkRow label="Govern" score={88} />
                <FrameworkRow label="Map" score={73} />
                <FrameworkRow label="Measure" score={61} />
                <FrameworkRow label="Manage" score={77} />
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      PRIORITY SYSTEMS
                    </span>
                    <h2>Highest-Risk AI Systems</h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage("AI Inventory")}
                  >
                    View all
                  </button>
                </div>

                <div className="risk-table">
                  <div className="table-row table-head">
                    <span>AI system</span>
                    <span>Department</span>
                    <span>Risk</span>
                    <span>Owner</span>
                  </div>

                  {systems
                    .filter(
                      (system) =>
                        system.risk === "Critical" ||
                        system.risk === "High"
                    )
                    .slice(0, 4)
                    .map((system) => (
                      <RiskRow
                        key={system.id}
                        name={system.name}
                        dept={system.department}
                        risk={system.risk}
                        owner={system.owner}
                      />
                    ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      ACTION TRACKER
                    </span>
                    <h2>Remediation</h2>
                  </div>
                </div>

                <div className="remediation-number">14</div>

                <p className="muted">
                  Open remediation actions
                </p>

                <div className="action-stats">
                  <div>
                    <strong>6</strong>
                    <span>Overdue</span>
                  </div>

                  <div>
                    <strong>5</strong>
                    <span>Due soon</span>
                  </div>

                  <div>
                    <strong>3</strong>
                    <span>On track</span>
                  </div>
                </div>

                <button
                  className="secondary-full"
                  onClick={() => setActivePage("Remediation")}
                >
                  Open remediation tracker
                </button>
              </div>
            </section>
          </>
        ) : activePage === "AI Inventory" ? (
          <AIInventory systems={systems} />
        ) : activePage === "Risk Assessments" ? (
          <RiskAssessments
            systems={systems}
            assessments={assessments}
            onAssessmentComplete={(result) => {
              setAssessments((current) => [result, ...current]);

              setSystems((current) =>
                current.map((system) =>
                  system.id === result.systemId
                    ? {
                        ...system,
                        risk: result.risk,
                        status:
                          result.risk === "Critical" ||
                          result.risk === "High"
                            ? "Review required"
                            : "Assessed",
                      }
                    : system
                )
              );
            }}
          />
        ) : (
          <section className="placeholder-page">
            <span className="eyebrow">
              AEGISAI MODULE
            </span>

            <h2>{activePage}</h2>

            <p>
              This module will be built next and connected to
              the AegisAI risk engine.
            </p>
          </section>
        )}
      </main>

      {showAddSystem && (
        <AddSystemModal
          onClose={() => setShowAddSystem(false)}
          onAdd={(system) =>
            setSystems((current) => [...current, system])
          }
        />
      )}
    </div>
  );
}

function RiskAssessments({
  systems,
  assessments,
  onAssessmentComplete,
}: {
  systems: AISystem[];
  assessments: AssessmentResult[];
  onAssessmentComplete: (result: AssessmentResult) => void;
}) {
  const [selectedSystemId, setSelectedSystemId] =
    useState<number>(systems[0]?.id ?? 0);

  const [answers, setAnswers] =
    useState<Record<string, number>>({});

  const [result, setResult] =
    useState<AssessmentResult | null>(null);

  const selectedSystem = systems.find(
    (system) => system.id === selectedSystemId
  );

  const answeredCount = Object.keys(answers).length;

  const completion = Math.round(
    (answeredCount / assessmentQuestions.length) * 100
  );

  function calculateAssessment() {
    if (!selectedSystem) return;

    if (
      Object.keys(answers).length !==
      assessmentQuestions.length
    ) {
      alert("Please answer all assessment questions first.");
      return;
    }

    const likelihoodAnswers = assessmentQuestions
      .filter(
        (question) =>
          question.dimension === "likelihood"
      )
      .map((question) => answers[question.id]);

    const impactAnswers = assessmentQuestions
      .filter(
        (question) => question.dimension === "impact"
      )
      .map((question) => answers[question.id]);

    const likelihood =
      likelihoodAnswers.reduce(
        (sum, value) => sum + value,
        0
      ) / likelihoodAnswers.length;

    const impact =
      impactAnswers.reduce(
        (sum, value) => sum + value,
        0
      ) / impactAnswers.length;

    const score = Math.round(likelihood * impact);

    let risk: RiskLevel = "Low";

    if (score >= 17) {
      risk = "Critical";
    } else if (score >= 10) {
      risk = "High";
    } else if (score >= 5) {
      risk = "Medium";
    }

    const frameworkNames = [
      "Govern",
      "Map",
      "Measure",
      "Manage",
    ] as const;

    const framework = frameworkNames.reduce(
      (acc, frameworkName) => {
        const frameworkQuestions =
          assessmentQuestions.filter(
            (question) =>
              question.framework === frameworkName
          );

        const frameworkRisk =
          frameworkQuestions.reduce(
            (sum, question) =>
              sum + answers[question.id],
            0
          ) / frameworkQuestions.length;

        acc[frameworkName] = Math.round(
          100 - ((frameworkRisk - 1) / 4) * 75
        );

        return acc;
      },
      {
        Govern: 0,
        Map: 0,
        Measure: 0,
        Manage: 0,
      }
    );

    const assessmentResult: AssessmentResult = {
      id: Date.now(),
      systemId: selectedSystem.id,
      systemName: selectedSystem.name,
      date: new Date().toLocaleDateString(),
      likelihood: Number(likelihood.toFixed(1)),
      impact: Number(impact.toFixed(1)),
      score,
      risk,
      framework,
    };

    setResult(assessmentResult);
    onAssessmentComplete(assessmentResult);
  }

  function startNewAssessment() {
    setAnswers({});
    setResult(null);
  }

  return (
    <>
      <section className="assessment-top-grid">
        <div className="assessment-intro">
          <span className="panel-label">
            AI RISK ASSESSMENT
          </span>

          <h2>Assess AI System Risk</h2>

          <p>
            Evaluate inherent AI risk across business impact,
            cybersecurity, governance, third-party dependency
            and model reliability.
          </p>
        </div>

        <div className="assessment-progress-card">
          <div>
            <span>Assessment progress</span>
            <strong>{completion}%</strong>
          </div>

          <div className="assessment-progress-track">
            <div
              style={{ width: `${completion}%` }}
            />
          </div>

          <small>
            {answeredCount} of {assessmentQuestions.length} questions completed
          </small>
        </div>
      </section>

      {!result ? (
        <section className="assessment-layout">
          <div className="assessment-form-panel">
            <div className="assessment-system-selector">
              <div>
                <span className="panel-label">
                  SYSTEM SCOPE
                </span>

                <h3>Select AI System</h3>
              </div>

              <select
                value={selectedSystemId}
                onChange={(e) => {
                  setSelectedSystemId(
                    Number(e.target.value)
                  );
                  setAnswers({});
                }}
              >
                {systems.map((system) => (
                  <option
                    key={system.id}
                    value={system.id}
                  >
                    {system.name} · {system.department}
                  </option>
                ))}
              </select>
            </div>

            {selectedSystem && (
              <div className="selected-system-card">
                <div className="system-icon large">
                  {selectedSystem.name.charAt(0)}
                </div>

                <div>
                  <strong>{selectedSystem.name}</strong>
                  <span>
                    {selectedSystem.department} ·{" "}
                    {selectedSystem.vendor}
                  </span>
                </div>

                <div className="selected-system-meta">
                  <span>
                    Data:{" "}
                    <strong>
                      {selectedSystem.dataSensitivity}
                    </strong>
                  </span>

                  <span>
                    Criticality:{" "}
                    <strong>
                      {selectedSystem.criticality}
                    </strong>
                  </span>
                </div>
              </div>
            )}

            <div className="question-list">
              {assessmentQuestions.map(
                (question, index) => (
                  <div
                    className="assessment-question"
                    key={question.id}
                  >
                    <div className="question-number">
                      {index + 1}
                    </div>

                    <div className="question-content">
                      <div className="question-heading">
                        <div>
                          <h3>{question.title}</h3>
                          <p>
                            {question.description}
                          </p>
                        </div>

                        <span className="framework-badge">
                          {question.framework}
                        </span>
                      </div>

                      <div className="risk-scale">
                        {[1, 2, 3, 4, 5].map(
                          (score) => (
                            <button
                              type="button"
                              key={score}
                              className={
                                answers[
                                  question.id
                                ] === score
                                  ? "scale-option selected"
                                  : "scale-option"
                              }
                              onClick={() =>
                                setAnswers(
                                  (current) => ({
                                    ...current,
                                    [question.id]:
                                      score,
                                  })
                                )
                              }
                            >
                              <strong>{score}</strong>

                              <span>
                                {score === 1
                                  ? "Very low"
                                  : score === 2
                                  ? "Low"
                                  : score === 3
                                  ? "Moderate"
                                  : score === 4
                                  ? "High"
                                  : "Very high"}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="assessment-submit">
              <div>
                <strong>
                  Ready to calculate?
                </strong>

                <span>
                  AegisAI will calculate likelihood,
                  impact and overall risk.
                </span>
              </div>

              <button
                className="primary-small"
                onClick={calculateAssessment}
              >
                Calculate risk
              </button>
            </div>
          </div>

          <aside className="assessment-methodology">
            <span className="panel-label">
              METHODOLOGY
            </span>

            <h3>Risk Scoring</h3>

            <p>
              Each question is scored from 1 to 5.
            </p>

            <div className="formula-card">
              <span>Risk Score</span>
              <strong>
                Likelihood × Impact
              </strong>
            </div>

            <div className="methodology-level">
              <span className="risk-dot low" />
              <div>
                <strong>Low</strong>
                <small>1–4</small>
              </div>
            </div>

            <div className="methodology-level">
              <span className="risk-dot medium" />
              <div>
                <strong>Medium</strong>
                <small>5–9</small>
              </div>
            </div>

            <div className="methodology-level">
              <span className="risk-dot high" />
              <div>
                <strong>High</strong>
                <small>10–16</small>
              </div>
            </div>

            <div className="methodology-level">
              <span className="risk-dot critical" />
              <div>
                <strong>Critical</strong>
                <small>17–25</small>
              </div>
            </div>

            <div className="methodology-note">
              <strong>NIST AI RMF</strong>

              <p>
                Questions are mapped to Govern, Map,
                Measure and Manage.
              </p>
            </div>
          </aside>
        </section>
      ) : (
        <AssessmentResultView
          result={result}
          onNewAssessment={startNewAssessment}
        />
      )}

      {assessments.length > 0 && (
        <section className="assessment-history-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                ASSESSMENT HISTORY
              </span>

              <h2>Completed Assessments</h2>
            </div>
          </div>

          <div className="assessment-history-table">
            <div className="assessment-history-row history-head">
              <span>AI System</span>
              <span>Date</span>
              <span>Likelihood</span>
              <span>Impact</span>
              <span>Score</span>
              <span>Risk</span>
            </div>

            {assessments.map((assessment) => (
              <div
                className="assessment-history-row"
                key={assessment.id}
              >
                <strong>
                  {assessment.systemName}
                </strong>

                <span>{assessment.date}</span>

                <span>
                  {assessment.likelihood} / 5
                </span>

                <span>
                  {assessment.impact} / 5
                </span>

                <span>
                  {assessment.score} / 25
                </span>

                <span
                  className={`risk-pill ${assessment.risk.toLowerCase()}`}
                >
                  {assessment.risk}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function AssessmentResultView({
  result,
  onNewAssessment,
}: {
  result: AssessmentResult;
  onNewAssessment: () => void;
}) {
  return (
    <section className="assessment-result-panel">
      <div className="result-header">
        <div>
          <span className="panel-label">
            ASSESSMENT COMPLETE
          </span>

          <h2>{result.systemName}</h2>

          <p>
            Risk assessment completed on {result.date}.
          </p>
        </div>

        <button
          className="primary-small"
          onClick={onNewAssessment}
        >
          + New assessment
        </button>
      </div>

      <div className="result-grid">
        <div className="result-score-card">
          <span>Overall risk score</span>

          <strong>{result.score}</strong>

          <small>/ 25</small>

          <div
            className={`result-risk-label ${result.risk.toLowerCase()}`}
          >
            {result.risk} Risk
          </div>
        </div>

        <div className="result-metrics">
          <div>
            <span>Likelihood</span>
            <strong>
              {result.likelihood} / 5
            </strong>
          </div>

          <div>
            <span>Impact</span>
            <strong>{result.impact} / 5</strong>
          </div>

          <div>
            <span>Risk treatment</span>
            <strong>
              {result.risk === "Critical"
                ? "Immediate action"
                : result.risk === "High"
                ? "Priority remediation"
                : result.risk === "Medium"
                ? "Monitor & improve"
                : "Accept / monitor"}
            </strong>
          </div>
        </div>
      </div>

      <div className="result-framework-section">
        <div>
          <span className="panel-label">
            NIST AI RMF MAPPING
          </span>

          <h3>Governance Readiness</h3>
        </div>

        <div className="result-framework-grid">
          <FrameworkScore
            name="Govern"
            score={result.framework.Govern}
          />

          <FrameworkScore
            name="Map"
            score={result.framework.Map}
          />

          <FrameworkScore
            name="Measure"
            score={result.framework.Measure}
          />

          <FrameworkScore
            name="Manage"
            score={result.framework.Manage}
          />
        </div>
      </div>

      <div className="result-recommendation">
        <span className="panel-label">
          AEGISAI RECOMMENDATION
        </span>

        <h3>
          {result.risk === "Critical"
            ? "Escalate to governance leadership immediately."
            : result.risk === "High"
            ? "Prioritize remediation before expanding system use."
            : result.risk === "Medium"
            ? "Continue operation with targeted control improvements."
            : "Maintain controls and monitor risk periodically."}
        </h3>

        <p>
          Focus on the weakest NIST AI RMF area and
          document ownership, controls and remediation
          actions before the next review.
        </p>
      </div>
    </section>
  );
}

function FrameworkScore({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  return (
    <div className="framework-score-card">
      <div>
        <strong>{name}</strong>
        <span>{score}%</span>
      </div>

      <div className="framework-track">
        <div style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function AIInventory({
  systems,
}: {
  systems: AISystem[];
}) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] =
    useState("All");

  const filteredSystems = systems.filter(
    (system) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        system.name
          .toLowerCase()
          .includes(searchText) ||
        system.department
          .toLowerCase()
          .includes(searchText) ||
        system.vendor
          .toLowerCase()
          .includes(searchText) ||
        system.owner
          .toLowerCase()
          .includes(searchText);

      const matchesRisk =
        riskFilter === "All" ||
        system.risk === riskFilter;

      return matchesSearch && matchesRisk;
    }
  );

  const highRisk = systems.filter(
    (system) =>
      system.risk === "High" ||
      system.risk === "Critical"
  ).length;

  const departments = new Set(
    systems.map((system) => system.department)
  ).size;

  const reviews = systems.filter(
    (system) =>
      system.status === "Review required" ||
      system.status === "Assessment due"
  ).length;

  return (
    <>
      <section className="inventory-summary">
        <Metric
          label="Registered AI Systems"
          value={String(systems.length)}
          detail="Enterprise inventory"
        />

        <Metric
          label="High / Critical Risk"
          value={String(highRisk)}
          detail="Requires governance attention"
          alert
        />

        <Metric
          label="Departments"
          value={String(departments)}
          detail="Using AI systems"
        />

        <Metric
          label="Reviews Due"
          value={String(reviews)}
          detail="Governance actions required"
        />
      </section>

      <section className="inventory-panel">
        <div className="inventory-toolbar">
          <div>
            <span className="panel-label">
              AI ASSET INVENTORY
            </span>

            <h2>Enterprise AI Systems</h2>

            <p>
              Central register of AI systems, business
              owners, vendors and risk classifications.
            </p>
          </div>

          <div className="inventory-filters">
            <input
              type="text"
              placeholder="Search systems..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(e.target.value)
              }
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <div className="inventory-table">
            <div className="inventory-row inventory-head">
              <span>AI system</span>
              <span>Department</span>
              <span>Vendor</span>
              <span>Owner</span>
              <span>Data</span>
              <span>Risk</span>
              <span>Status</span>
            </div>

            {filteredSystems.map((system) => (
              <div
                className="inventory-row"
                key={system.id}
              >
                <div className="system-name-cell">
                  <div className="system-icon">
                    {system.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{system.name}</strong>

                    <small>
                      {system.criticality} criticality
                    </small>
                  </div>
                </div>

                <span>{system.department}</span>
                <span>{system.vendor}</span>
                <span>{system.owner}</span>

                <span className="data-pill">
                  {system.dataSensitivity}
                </span>

                <span
                  className={`risk-pill ${system.risk.toLowerCase()}`}
                >
                  {system.risk}
                </span>

                <span className="status-text">
                  {system.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="inventory-footer">
          Showing {filteredSystems.length} of{" "}
          {systems.length} AI systems
        </div>
      </section>
    </>
  );
}

function AddSystemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (system: AISystem) => void;
}) {
  const [name, setName] = useState("");
  const [department, setDepartment] =
    useState("");
  const [owner, setOwner] = useState("");
  const [vendor, setVendor] = useState("");
  const [
    dataSensitivity,
    setDataSensitivity,
  ] = useState("Internal");
  const [criticality, setCriticality] =
    useState("Medium");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (
      !name ||
      !department ||
      !owner ||
      !vendor
    ) {
      return;
    }

    onAdd({
      id: Date.now(),
      name,
      department,
      owner,
      vendor,
      dataSensitivity,
      criticality,
      risk: "Medium",
      status: "Assessment due",
    });

    onClose();
  }

  return (
    <div className="modal-backdrop">
      <form
        className="system-modal"
        onSubmit={handleSubmit}
      >
        <div className="modal-heading">
          <div>
            <span className="panel-label">
              AI GOVERNANCE
            </span>

            <h2>Register AI System</h2>

            <p>
              Add a new AI system to the NovaBridge
              enterprise inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-grid">
          <label>
            AI system name
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Marketing Copilot"
            />
          </label>

          <label>
            Department
            <input
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              placeholder="e.g. Marketing"
            />
          </label>

          <label>
            Business owner
            <input
              value={owner}
              onChange={(e) =>
                setOwner(e.target.value)
              }
              placeholder="e.g. Rami S."
            />
          </label>

          <label>
            Vendor
            <input
              value={vendor}
              onChange={(e) =>
                setVendor(e.target.value)
              }
              placeholder="e.g. OpenAI"
            />
          </label>

          <label>
            Data sensitivity
            <select
              value={dataSensitivity}
              onChange={(e) =>
                setDataSensitivity(
                  e.target.value
                )
              }
            >
              <option>Public</option>
              <option>Internal</option>
              <option>Confidential</option>
              <option>Restricted</option>
            </select>
          </label>

          <label>
            Business criticality
            <select
              value={criticality}
              onChange={(e) =>
                setCriticality(e.target.value)
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="primary-small"
            type="submit"
          >
            Register system
          </button>
        </div>
      </form>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  alert = false,
}: {
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className="metric-card">
      <span>{label}</span>

      <strong
        className={alert ? "alert-value" : ""}
      >
        {value}
      </strong>

      <small>{detail}</small>
    </div>
  );
}

function RiskBar({
  label,
  value,
  width,
}: {
  label: string;
  value: number;
  width: number;
}) {
  return (
    <div className="risk-bar-row">
      <span>{label}</span>

      <div className="bar-track">
        <div
          className={`bar-fill ${label.toLowerCase()}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <strong>{value}</strong>
    </div>
  );
}

function FrameworkRow({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div className="framework-row">
      <div>
        <strong>{label}</strong>
        <span>{score}%</span>
      </div>

      <div className="framework-track">
        <div
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function RiskRow({
  name,
  dept,
  risk,
  owner,
}: {
  name: string;
  dept: string;
  risk: string;
  owner: string;
}) {
  return (
    <div className="table-row">
      <strong>{name}</strong>
      <span>{dept}</span>

      <span
        className={`risk-pill ${risk.toLowerCase()}`}
      >
        {risk}
      </span>

      <span>{owner}</span>
    </div>
  );
}

export default App;