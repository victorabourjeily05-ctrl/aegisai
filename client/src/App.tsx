import { useState } from "react";
import "./App.css";

type Page =
  | "Dashboard"
  | "AI Inventory"
  | "Risk Assessments"
  | "Risk Register"
  | "Controls"
  | "Vendors"
  | "Remediation";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>("Dashboard");

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

          <button className="primary-button" onClick={() => setLoggedIn(true)}>
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
            <button className="secondary-button">Export report</button>
            <button className="primary-small">+ New assessment</button>
          </div>
        </header>

        {activePage === "Dashboard" ? (
          <>
            <section className="summary-grid">
              <Metric
                label="AI Systems"
                value="24"
                detail="+3 this quarter"
              />
              <Metric
                label="High-Risk Systems"
                value="5"
                detail="Requires attention"
                alert
              />
              <Metric label="Open Risks" value="17" detail="6 overdue" />
              <Metric
                label="Control Coverage"
                value="82%"
                detail="+7% since last review"
              />
            </section>

            <section className="dashboard-grid">
              <div className="panel risk-overview">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">ENTERPRISE EXPOSURE</span>
                    <h2>AI Risk Overview</h2>
                  </div>
                  <button className="mini-button">Last 90 days ▾</button>
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

            <section className="dashboard-grid bottom-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">PRIORITY SYSTEMS</span>
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

                  <RiskRow
                    name="RecruitAI"
                    dept="Human Resources"
                    risk="Critical"
                    owner="Sarah K."
                  />
                  <RiskRow
                    name="Finance Copilot"
                    dept="Finance"
                    risk="High"
                    owner="Omar H."
                  />
                  <RiskRow
                    name="CustomerAssist"
                    dept="Customer Service"
                    risk="High"
                    owner="Lina M."
                  />
                  <RiskRow
                    name="ThreatLens AI"
                    dept="Information Security"
                    risk="Medium"
                    owner="Karim A."
                  />
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">ACTION TRACKER</span>
                    <h2>Remediation</h2>
                  </div>
                </div>

                <div className="remediation-number">14</div>
                <p className="muted">Open remediation actions</p>

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
        ) : (
          <section className="placeholder-page">
            <span className="eyebrow">AEGISAI MODULE</span>
            <h2>{activePage}</h2>
            <p>
              This module will be built next and connected to the AegisAI risk
              engine.
            </p>
          </section>
        )}
      </main>
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
      <strong className={alert ? "alert-value" : ""}>{value}</strong>
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
        <div className={`bar-fill ${label.toLowerCase()}`} style={{ width: `${width}%` }} />
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
        <div style={{ width: `${score}%` }} />
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
      <span className={`risk-pill ${risk.toLowerCase()}`}>{risk}</span>
      <span>{owner}</span>
    </div>
  );
}

export default App;