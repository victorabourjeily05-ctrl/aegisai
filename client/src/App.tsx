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
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<Page>("Dashboard");
  const [systems, setSystems] = useState<AISystem[]>(initialSystems);
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
            <p className="breadcrumb">
              NovaBridge Group / {activePage}
            </p>

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
            ) : (
              <>
                <button className="secondary-button">
                  Export report
                </button>

                <button className="primary-small">
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
                value={String(systems.length + 18)}
                detail="+3 this quarter"
              />

              <Metric
                label="High-Risk Systems"
                value="5"
                detail="Requires attention"
                alert
              />

              <Metric
                label="Open Risks"
                value="17"
                detail="6 overdue"
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
                    <RiskBar
                      label="Critical"
                      value={2}
                      width={18}
                    />

                    <RiskBar
                      label="High"
                      value={5}
                      width={42}
                    />

                    <RiskBar
                      label="Medium"
                      value={9}
                      width={68}
                    />

                    <RiskBar
                      label="Low"
                      value={8}
                      width={58}
                    />
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
        ) : (
          <section className="placeholder-page">
            <span className="eyebrow">
              AEGISAI MODULE
            </span>

            <h2>{activePage}</h2>

            <p>
              This module will be built next and connected
              to the AegisAI risk engine.
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

function AIInventory({
  systems,
}: {
  systems: AISystem[];
}) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const filteredSystems = systems.filter((system) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      system.name.toLowerCase().includes(searchText) ||
      system.department.toLowerCase().includes(searchText) ||
      system.vendor.toLowerCase().includes(searchText) ||
      system.owner.toLowerCase().includes(searchText);

    const matchesRisk =
      riskFilter === "All" || system.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

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
              Central register of AI systems, business owners,
              vendors and risk classifications.
            </p>
          </div>

          <div className="inventory-filters">
            <input
              type="text"
              placeholder="Search systems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
  const [department, setDepartment] = useState("");
  const [owner, setOwner] = useState("");
  const [vendor, setVendor] = useState("");
  const [dataSensitivity, setDataSensitivity] =
    useState("Internal");
  const [criticality, setCriticality] =
    useState("Medium");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!name || !department || !owner || !vendor) {
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
                setDataSensitivity(e.target.value)
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