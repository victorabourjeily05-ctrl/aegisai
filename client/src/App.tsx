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

type ControlStatus =
  | "Implemented"
  | "Partial"
  | "Planned"
  | "Not implemented";

type ControlEffectiveness =
  | "Effective"
  | "Partially effective"
  | "Not tested"
  | "Ineffective";

type VendorStatus =
  | "Approved"
  | "Conditional"
  | "Review required"
  | "Blocked";

type DueDiligenceStatus =
  | "Complete"
  | "Partial"
  | "Not started";

type RemediationStatus =
  | "Not started"
  | "In progress"
  | "Blocked"
  | "Completed";

type Priority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

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

type RiskRecord = {
  id: string;
  systemId: number;
  systemName: string;
  category: string;
  statement: string;
  owner: string;
  likelihood: number;
  impact: number;
  score: number;
  risk: RiskLevel;
  treatment: string;
  status: string;
  residualScore: number;
  residualRisk: RiskLevel;
};

type ControlRecord = {
  id: string;
  name: string;
  description: string;
  framework: "Govern" | "Map" | "Measure" | "Manage";
  category: string;
  owner: string;
  status: ControlStatus;
  effectiveness: ControlEffectiveness;
  linkedRiskIds: string[];
  evidence: string;
  reviewDate: string;
};

type VendorRecord = {
  id: string;
  name: string;
  service: string;
  owner: string;
  status: VendorStatus;
  dueDiligence: DueDiligenceStatus;
  dataProcessing: string;
  securityRisk: number;
  privacyRisk: number;
  resilienceRisk: number;
  complianceRisk: number;
  dependencyRisk: number;
  evidence: string;
  nextReview: string;
};

type RemediationAction = {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: Priority;
  status: RemediationStatus;
  dueDate: string;
  progress: number;
  linkedRiskIds: string[];
  linkedControlIds: string[];
  notes: string;
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
    risk: "High",
    status: "Review required",
  },
];

const initialAssessments: AssessmentResult[] = [
  {
    id: 1001,
    systemId: 7,
    systemName: "Marketing Copilot",
    date: "10/6/2026",
    likelihood: 3.8,
    impact: 3.5,
    score: 13,
    risk: "High",
    framework: {
      Govern: 56,
      Map: 44,
      Measure: 44,
      Manage: 53,
    },
  },
];

const initialRisks: RiskRecord[] = [
  {
    id: "RISK-001",
    systemId: 1,
    systemName: "RecruitAI",
    category: "Governance & Compliance",
    statement:
      "RecruitAI may produce biased or insufficiently explainable candidate screening decisions, creating employment, regulatory and reputational exposure.",
    owner: "Sarah K.",
    likelihood: 4,
    impact: 5,
    score: 20,
    risk: "Critical",
    treatment: "Mitigate",
    status: "In progress",
    residualScore: 12,
    residualRisk: "High",
  },
  {
    id: "RISK-002",
    systemId: 2,
    systemName: "Finance Copilot",
    category: "Data & Business Impact",
    statement:
      "Finance Copilot may expose confidential financial information or generate inaccurate analysis that influences business decisions.",
    owner: "Omar H.",
    likelihood: 3.5,
    impact: 4,
    score: 14,
    risk: "High",
    treatment: "Mitigate",
    status: "Open",
    residualScore: 8,
    residualRisk: "Medium",
  },
  {
    id: "RISK-003",
    systemId: 7,
    systemName: "Marketing Copilot",
    category: "Model Reliability",
    statement:
      "Marketing Copilot may generate inaccurate or inappropriate content while processing confidential marketing information, creating operational and reputational risk.",
    owner: "Victor A.",
    likelihood: 3.8,
    impact: 3.5,
    score: 13,
    risk: "High",
    treatment: "Mitigate",
    status: "In progress",
    residualScore: 7,
    residualRisk: "Medium",
  },
];

const initialControls: ControlRecord[] = [
  {
    id: "CTRL-001",
    name: "Human Review of High-Risk AI Decisions",
    description:
      "Require qualified human review before high-impact AI recommendations or decisions are acted upon.",
    framework: "Govern",
    category: "Human Oversight",
    owner: "AI Governance",
    status: "Partial",
    effectiveness: "Partially effective",
    linkedRiskIds: ["RISK-001", "RISK-003"],
    evidence: "HR AI approval workflow documented.",
    reviewDate: "2026-12-15",
  },
  {
    id: "CTRL-002",
    name: "MFA & Privileged Access",
    description:
      "Require multi-factor authentication and controlled privileged access for administrative AI platform functions.",
    framework: "Manage",
    category: "Access Control",
    owner: "Information Security",
    status: "Implemented",
    effectiveness: "Effective",
    linkedRiskIds: ["RISK-002", "RISK-003"],
    evidence: "MFA configuration and access review evidence.",
    reviewDate: "2027-01-15",
  },
  {
    id: "CTRL-003",
    name: "Sensitive Data Protection",
    description:
      "Apply data classification, least privilege, encryption and approved handling rules to sensitive information used by AI systems.",
    framework: "Map",
    category: "Data Protection",
    owner: "Data Governance",
    status: "Implemented",
    effectiveness: "Partially effective",
    linkedRiskIds: ["RISK-002", "RISK-003"],
    evidence: "Data classification standard and encryption controls.",
    reviewDate: "2026-11-30",
  },
  {
    id: "CTRL-004",
    name: "AI Activity Logging",
    description:
      "Record privileged actions, significant AI activity and security events to support monitoring and investigations.",
    framework: "Measure",
    category: "Monitoring",
    owner: "Security Operations",
    status: "Implemented",
    effectiveness: "Effective",
    linkedRiskIds: ["RISK-002"],
    evidence: "Centralized activity logs retained for review.",
    reviewDate: "2027-01-10",
  },
  {
    id: "CTRL-005",
    name: "Model Accuracy & Bias Testing",
    description:
      "Test models and AI-enabled workflows for accuracy, bias, harmful outputs and material performance degradation.",
    framework: "Measure",
    category: "Model Risk",
    owner: "Model Assurance",
    status: "Implemented",
    effectiveness: "Effective",
    linkedRiskIds: ["RISK-001", "RISK-003"],
    evidence:
      "Model bias and accuracy test report v1.0 reviewed and approved.",
    reviewDate: "2026-11-15",
  },
  {
    id: "CTRL-006",
    name: "Third-Party AI Vendor Review",
    description:
      "Evaluate security, privacy, resilience, contractual and governance risks before approving external AI vendors.",
    framework: "Govern",
    category: "Third-Party Risk",
    owner: "Vendor Risk",
    status: "Implemented",
    effectiveness: "Partially effective",
    linkedRiskIds: ["RISK-001", "RISK-002", "RISK-003"],
    evidence: "Vendor due diligence questionnaire completed.",
    reviewDate: "2027-02-01",
  },
  {
    id: "CTRL-007",
    name: "AI Incident Response",
    description:
      "Define escalation, containment, communication and recovery procedures for AI-related incidents.",
    framework: "Manage",
    category: "Incident Response",
    owner: "Information Security",
    status: "Implemented",
    effectiveness: "Effective",
    linkedRiskIds: ["RISK-001", "RISK-002", "RISK-003"],
    evidence: "AI incident playbook approved.",
    reviewDate: "2027-01-31",
  },
  {
    id: "CTRL-008",
    name: "Prompt & Data Retention Governance",
    description:
      "Define approved retention, deletion and usage rules for prompts, outputs and sensitive data submitted to AI services.",
    framework: "Govern",
    category: "Data Governance",
    owner: "Privacy Office",
    status: "Implemented",
    effectiveness: "Effective",
    linkedRiskIds: ["RISK-002", "RISK-003"],
    evidence: "Retention standard and user guidance published.",
    reviewDate: "2026-12-20",
  },
];

const initialVendors: VendorRecord[] = [
  {
    id: "VND-001",
    name: "OpenAI",
    service: "Generative AI / LLM services",
    owner: "Technology Procurement",
    status: "Conditional",
    dueDiligence: "Complete",
    dataProcessing: "Confidential business and customer data",
    securityRisk: 2,
    privacyRisk: 3,
    resilienceRisk: 2,
    complianceRisk: 2,
    dependencyRisk: 4,
    evidence:
      "Security, privacy and contractual due diligence reviewed. Residual concentration dependency retained for monitoring.",
    nextReview: "2026-11-20",
  },
  {
    id: "VND-002",
    name: "Microsoft",
    service: "Enterprise Copilot services",
    owner: "IT Procurement",
    status: "Approved",
    dueDiligence: "Complete",
    dataProcessing: "Confidential financial information",
    securityRisk: 2,
    privacyRisk: 2,
    resilienceRisk: 2,
    complianceRisk: 2,
    dependencyRisk: 2,
    evidence:
      "Enterprise security, privacy and contractual review completed.",
    nextReview: "2027-03-15",
  },
  {
    id: "VND-003",
    name: "Anthropic",
    service: "Generative AI / LLM services",
    owner: "Legal Technology",
    status: "Conditional",
    dueDiligence: "Partial",
    dataProcessing: "Confidential legal information",
    securityRisk: 3,
    privacyRisk: 3,
    resilienceRisk: 3,
    complianceRisk: 3,
    dependencyRisk: 3,
    evidence:
      "Initial vendor review completed; contractual controls under review.",
    nextReview: "2026-12-05",
  },
  {
    id: "VND-004",
    name: "HireSense AI",
    service: "AI recruitment screening",
    owner: "HR Procurement",
    status: "Review required",
    dueDiligence: "Partial",
    dataProcessing: "Restricted candidate and employment data",
    securityRisk: 4,
    privacyRisk: 4,
    resilienceRisk: 3,
    complianceRisk: 4,
    dependencyRisk: 4,
    evidence:
      "Bias testing and regulatory evidence incomplete.",
    nextReview: "2026-10-31",
  },
];

const initialRemediation: RemediationAction[] = [
  {
    id: "REM-001",
    title: "Strengthen RecruitAI human oversight",
    description:
      "Implement mandatory human approval for high-impact recruitment decisions and document reviewer accountability.",
    owner: "Sarah K.",
    priority: "Critical",
    status: "In progress",
    dueDate: "2026-10-14",
    progress: 65,
    linkedRiskIds: ["RISK-001"],
    linkedControlIds: ["CTRL-001"],
    notes:
      "Workflow design completed. HR reviewer training remains outstanding.",
  },
  {
    id: "REM-002",
    title: "Complete HireSense AI governance evidence",
    description:
      "Obtain missing bias testing, regulatory compliance and assurance evidence from HireSense AI.",
    owner: "Vendor Risk",
    priority: "Critical",
    status: "Blocked",
    dueDate: "2026-10-05",
    progress: 35,
    linkedRiskIds: ["RISK-001"],
    linkedControlIds: ["CTRL-005", "CTRL-006"],
    notes:
      "Waiting for vendor response regarding independent bias testing.",
  },
  {
    id: "REM-003",
    title: "Validate Finance Copilot data safeguards",
    description:
      "Confirm confidential finance data handling, access restrictions and encryption controls.",
    owner: "Omar H.",
    priority: "High",
    status: "Not started",
    dueDate: "2026-10-18",
    progress: 10,
    linkedRiskIds: ["RISK-002"],
    linkedControlIds: ["CTRL-003"],
    notes:
      "Control validation evidence to be collected from Finance and IT.",
  },
  {
    id: "REM-004",
    title: "Reduce OpenAI concentration dependency",
    description:
      "Document alternative service options, contingency procedures and switching considerations for OpenAI-dependent workflows.",
    owner: "Victor A.",
    priority: "High",
    status: "In progress",
    dueDate: "2026-10-25",
    progress: 50,
    linkedRiskIds: ["RISK-003"],
    linkedControlIds: ["CTRL-006", "CTRL-008"],
    notes:
      "Alternative provider analysis initiated.",
  },
  {
    id: "REM-005",
    title: "Complete Marketing Copilot model assurance",
    description:
      "Perform accuracy and harmful-output testing and document final model assurance results.",
    owner: "Victor A.",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-10-06",
    progress: 100,
    linkedRiskIds: ["RISK-003"],
    linkedControlIds: ["CTRL-005"],
    notes:
      "Model bias and accuracy testing completed and approved.",
  },
  {
    id: "REM-006",
    title: "Run AI incident response tabletop",
    description:
      "Test escalation, containment, communication and recovery procedures using an AI-related incident scenario.",
    owner: "Information Security",
    priority: "Medium",
    status: "Not started",
    dueDate: "2026-11-01",
    progress: 0,
    linkedRiskIds: ["RISK-001", "RISK-002", "RISK-003"],
    linkedControlIds: ["CTRL-007"],
    notes:
      "Scenario and participants to be confirmed.",
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

function getRiskLevel(score: number): RiskLevel {
  if (score >= 17) return "Critical";
  if (score >= 10) return "High";
  if (score >= 5) return "Medium";
  return "Low";
}

function getVendorRiskScore(vendor: VendorRecord) {
  return (
    vendor.securityRisk +
    vendor.privacyRisk +
    vendor.resilienceRisk +
    vendor.complianceRisk +
    vendor.dependencyRisk
  );
}

function getVendorRiskLevel(score: number): RiskLevel {
  if (score >= 20) return "Critical";
  if (score >= 14) return "High";
  if (score >= 9) return "Medium";
  return "Low";
}

function calculateControlCoverage(controls: ControlRecord[]) {
  if (!controls.length) return 0;

  const points = controls.reduce((total, control) => {
    if (control.status === "Implemented") return total + 1;
    if (control.status === "Partial") return total + 0.5;
    return total;
  }, 0);

  return Math.round((points / controls.length) * 100);
}

function getRiskCategory(result: AssessmentResult) {
  const entries = Object.entries(result.framework) as [
    keyof AssessmentResult["framework"],
    number
  ][];

  const weakest = [...entries].sort(
    (a, b) => a[1] - b[1]
  )[0][0];

  if (weakest === "Govern") return "Governance & Compliance";
  if (weakest === "Map") return "Data & Business Impact";
  if (weakest === "Measure") return "Model Reliability";
  return "Security & Operations";
}

function createRiskStatement(
  system: AISystem,
  result: AssessmentResult
) {
  const category = getRiskCategory(result);

  if (category === "Governance & Compliance") {
    return `${system.name} may operate without sufficient governance, accountability or regulatory controls, creating legal, compliance and reputational exposure.`;
  }

  if (category === "Data & Business Impact") {
    return `${system.name} may expose ${system.dataSensitivity.toLowerCase()} information or disrupt critical ${system.department} processes if AI outputs are inaccurate or misused.`;
  }

  if (category === "Model Reliability") {
    return `${system.name} may generate inaccurate, biased or unreliable outputs that could negatively affect ${system.department} decisions and business outcomes.`;
  }

  return `${system.name} may be exposed to insufficient cybersecurity, monitoring or operational controls, increasing the likelihood of unauthorized access, misuse or service disruption.`;
}

function slug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function isOverdue(action: RemediationAction) {
  if (action.status === "Completed") return false;

  const deadline = new Date(
    `${action.dueDate}T23:59:59`
  ).getTime();

  return deadline < Date.now();
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] =
    useState<Page>("Dashboard");

  const [systems, setSystems] =
    useState<AISystem[]>(initialSystems);

  const [assessments, setAssessments] =
    useState<AssessmentResult[]>(initialAssessments);

  const [riskRecords, setRiskRecords] =
    useState<RiskRecord[]>(initialRisks);

  const [controls, setControls] =
    useState<ControlRecord[]>(initialControls);

  const [vendors, setVendors] =
    useState<VendorRecord[]>(initialVendors);

  const [remediation, setRemediation] =
    useState<RemediationAction[]>(initialRemediation);

  const [showAddSystem, setShowAddSystem] =
    useState(false);

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
            <span className="eyebrow">
              NOVABRIDGE GROUP
            </span>

            <h2>Welcome back</h2>

            <p>
              Sign in to access your AI governance workspace.
            </p>
          </div>

          <label>Work email</label>

          <input
            type="email"
            placeholder="victor@novabridge.com"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="••••••••••"
          />

          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button className="text-button">
              Forgot password?
            </button>
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
    (system) =>
      system.risk === "High" ||
      system.risk === "Critical"
  ).length;

  const controlCoverage =
    calculateControlCoverage(controls);

  const openRemediation =
    remediation.filter(
      (action) =>
        action.status !== "Completed"
    ).length;

  const overdueRemediation =
    remediation.filter(isOverdue).length;

  function handleAssessmentComplete(
    result: AssessmentResult
  ) {
    setAssessments((current) => [
      result,
      ...current,
    ]);

    const system = systems.find(
      (item) => item.id === result.systemId
    );

    setSystems((current) =>
      current.map((item) =>
        item.id === result.systemId
          ? {
              ...item,
              risk: result.risk,
              status:
                result.risk === "Critical" ||
                result.risk === "High"
                  ? "Review required"
                  : "Assessed",
            }
          : item
      )
    );

    if (!system) return;

    setRiskRecords((current) => {
      const existing = current.find(
        (risk) =>
          risk.systemId === result.systemId
      );

      if (existing) {
        return current.map((risk) =>
          risk.systemId === result.systemId
            ? {
                ...risk,
                category:
                  getRiskCategory(result),
                statement:
                  createRiskStatement(
                    system,
                    result
                  ),
                likelihood:
                  result.likelihood,
                impact: result.impact,
                score: result.score,
                risk: result.risk,
              }
            : risk
        );
      }

      const id = `RISK-${String(
        current.length + 1
      ).padStart(3, "0")}`;

      const residualScore = Math.max(
        1,
        result.score - 5
      );

      return [
        {
          id,
          systemId: system.id,
          systemName: system.name,
          category: getRiskCategory(result),
          statement:
            createRiskStatement(
              system,
              result
            ),
          owner: system.owner,
          likelihood: result.likelihood,
          impact: result.impact,
          score: result.score,
          risk: result.risk,
          treatment: "Mitigate",
          status: "Open",
          residualScore,
          residualRisk:
            getRiskLevel(residualScore),
        },
        ...current,
      ];
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small">
            A
          </div>

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
              className={
                activePage === page
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setActivePage(page)
              }
            >
              <span className="nav-dot" />
              {page}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="framework-card">
            <span>NIST AI RMF</span>

            <strong>
              Govern · Map · Measure · Manage
            </strong>
          </div>

          <button className="profile">
            <div className="avatar">
              VA
            </div>

            <div>
              <strong>
                Victor Abou Rjeily
              </strong>

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
                  onClick={() =>
                    setShowAddSystem(true)
                  }
                >
                  + Add AI system
                </button>
              </>
            ) : activePage ===
              "Risk Assessments" ? (
              <button className="secondary-button">
                Assessment methodology
              </button>
            ) : activePage ===
              "Risk Register" ? (
              <>
                <button className="secondary-button">
                  Export risk register
                </button>

                <button
                  className="primary-small"
                  onClick={() =>
                    setActivePage(
                      "Risk Assessments"
                    )
                  }
                >
                  + New assessment
                </button>
              </>
            ) : activePage === "Controls" ? (
              <button className="secondary-button">
                Export control matrix
              </button>
            ) : activePage === "Vendors" ? (
              <button className="secondary-button">
                Export vendor assessments
              </button>
            ) : activePage ===
              "Remediation" ? (
              <button className="secondary-button">
                Export remediation plan
              </button>
            ) : (
              <>
                <button className="secondary-button">
                  Export report
                </button>

                <button
                  className="primary-small"
                  onClick={() =>
                    setActivePage(
                      "Risk Assessments"
                    )
                  }
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
                value={String(
                  systems.length
                )}
                detail="Registered in inventory"
              />

              <Metric
                label="High-Risk Systems"
                value={String(
                  highRiskSystems
                )}
                detail="Requires attention"
                alert
              />

              <Metric
                label="Open Risks"
                value={String(
                  riskRecords.filter(
                    (risk) =>
                      risk.status !== "Closed"
                  ).length
                )}
                detail="Enterprise risk register"
              />

              <Metric
                label="Control Coverage"
                value={`${controlCoverage}%`}
                detail="Implementation coverage"
              />
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      ENTERPRISE EXPOSURE
                    </span>

                    <h2>
                      AI Risk Overview
                    </h2>
                  </div>

                  <button className="mini-button">
                    Last 90 days ▾
                  </button>
                </div>

                <div className="risk-score-area">
                  <div className="risk-score">
                    <span>
                      Overall risk
                    </span>

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
                    <span className="panel-label">
                      REMEDIATION
                    </span>

                    <h2>
                      Action Tracker
                    </h2>
                  </div>
                </div>

                <div className="remediation-number">
                  {openRemediation}
                </div>

                <p className="muted">
                  Open remediation actions
                </p>

                <div className="action-stats">
                  <div>
                    <strong>
                      {
                        remediation.filter(
                          (action) =>
                            action.priority ===
                              "Critical" &&
                            action.status !==
                              "Completed"
                        ).length
                      }
                    </strong>

                    <span>Critical</span>
                  </div>

                  <div>
                    <strong>
                      {overdueRemediation}
                    </strong>

                    <span>Overdue</span>
                  </div>

                  <div>
                    <strong>
                      {
                        remediation.filter(
                          (action) =>
                            action.status ===
                            "Completed"
                        ).length
                      }
                    </strong>

                    <span>Completed</span>
                  </div>
                </div>

                <button
                  className="secondary-full"
                  onClick={() =>
                    setActivePage(
                      "Remediation"
                    )
                  }
                >
                  Open action tracker
                </button>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      PRIORITY SYSTEMS
                    </span>

                    <h2>
                      Highest-Risk AI Systems
                    </h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      setActivePage(
                        "AI Inventory"
                      )
                    }
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
                        system.risk ===
                          "Critical" ||
                        system.risk ===
                          "High"
                    )
                    .slice(0, 4)
                    .map((system) => (
                      <RiskRow
                        key={system.id}
                        name={
                          system.name
                        }
                        dept={
                          system.department
                        }
                        risk={
                          system.risk
                        }
                        owner={
                          system.owner
                        }
                      />
                    ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-label">
                      CONTROL ASSURANCE
                    </span>

                    <h2>
                      Control Coverage
                    </h2>
                  </div>
                </div>

                <div className="remediation-number">
                  {controlCoverage}%
                </div>

                <p className="muted">
                  Weighted implementation coverage
                </p>

                <div className="action-stats">
                  <div>
                    <strong>
                      {
                        controls.filter(
                          (control) =>
                            control.status ===
                            "Implemented"
                        ).length
                      }
                    </strong>

                    <span>Implemented</span>
                  </div>

                  <div>
                    <strong>
                      {
                        controls.filter(
                          (control) =>
                            control.effectiveness ===
                            "Effective"
                        ).length
                      }
                    </strong>

                    <span>Effective</span>
                  </div>

                  <div>
                    <strong>
                      {
                        vendors.filter(
                          (vendor) =>
                            getVendorRiskLevel(
                              getVendorRiskScore(
                                vendor
                              )
                            ) === "High" ||
                            getVendorRiskLevel(
                              getVendorRiskScore(
                                vendor
                              )
                            ) ===
                              "Critical"
                        ).length
                      }
                    </strong>

                    <span>
                      High-risk vendors
                    </span>
                  </div>
                </div>

                <button
                  className="secondary-full"
                  onClick={() =>
                    setActivePage("Controls")
                  }
                >
                  Open control library
                </button>
              </div>
            </section>
          </>
        ) : activePage ===
          "AI Inventory" ? (
          <AIInventory
            systems={systems}
          />
        ) : activePage ===
          "Risk Assessments" ? (
          <RiskAssessments
            systems={systems}
            assessments={assessments}
            onAssessmentComplete={
              handleAssessmentComplete
            }
          />
        ) : activePage ===
          "Risk Register" ? (
          <RiskRegister
            risks={riskRecords}
            onUpdateRisk={(updated) =>
              setRiskRecords((current) =>
                current.map((risk) =>
                  risk.id === updated.id
                    ? updated
                    : risk
                )
              )
            }
          />
        ) : activePage ===
          "Controls" ? (
          <ControlsLibrary
            controls={controls}
            risks={riskRecords}
            onUpdateControl={(updated) =>
              setControls((current) =>
                current.map(
                  (control) =>
                    control.id ===
                    updated.id
                      ? updated
                      : control
                )
              )
            }
          />
        ) : activePage ===
          "Vendors" ? (
          <VendorsModule
            vendors={vendors}
            systems={systems}
            onUpdateVendor={(updated) =>
              setVendors((current) =>
                current.map((vendor) =>
                  vendor.id === updated.id
                    ? updated
                    : vendor
                )
              )
            }
          />
        ) : (
          <RemediationModule
            actions={remediation}
            risks={riskRecords}
            controls={controls}
            onUpdateAction={(updated) =>
              setRemediation((current) =>
                current.map((action) =>
                  action.id === updated.id
                    ? updated
                    : action
                )
              )
            }
          />
        )}
      </main>

      {showAddSystem && (
        <AddSystemModal
          onClose={() =>
            setShowAddSystem(false)
          }
          onAdd={(system) =>
            setSystems((current) => [
              ...current,
              system,
            ])
          }
        />
      )}
    </div>
  );
}

function RemediationModule({
  actions,
  risks,
  controls,
  onUpdateAction,
}: {
  actions: RemediationAction[];
  risks: RiskRecord[];
  controls: ControlRecord[];
  onUpdateAction: (
    action: RemediationAction
  ) => void;
}) {
  const [search, setSearch] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedAction,
    setSelectedAction,
  ] =
    useState<RemediationAction | null>(
      null
    );

  const filtered = actions.filter(
    (action) => {
      const q = search.toLowerCase();

      const matchesSearch =
        action.id
          .toLowerCase()
          .includes(q) ||
        action.title
          .toLowerCase()
          .includes(q) ||
        action.owner
          .toLowerCase()
          .includes(q);

      const matchesPriority =
        priorityFilter === "All" ||
        action.priority ===
          priorityFilter;

      const matchesStatus =
        statusFilter === "All" ||
        action.status === statusFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus
      );
    }
  );

  const open = actions.filter(
    (action) =>
      action.status !== "Completed"
  ).length;

  const priority = actions.filter(
    (action) =>
      (action.priority === "Critical" ||
        action.priority === "High") &&
      action.status !== "Completed"
  ).length;

  const overdue =
    actions.filter(isOverdue).length;

  const completed = actions.filter(
    (action) =>
      action.status === "Completed"
  ).length;

  return (
    <>
      <section className="remediation-summary">
        <Metric
          label="Open Actions"
          value={String(open)}
          detail="Remediation work outstanding"
        />

        <Metric
          label="High / Critical"
          value={String(priority)}
          detail="Priority remediation"
          alert
        />

        <Metric
          label="Overdue"
          value={String(overdue)}
          detail="Past target date"
          alert={overdue > 0}
        />

        <Metric
          label="Completed"
          value={String(completed)}
          detail="Actions successfully closed"
        />
      </section>

      <section className="remediation-panel">
        <div className="remediation-toolbar">
          <div>
            <span className="panel-label">
              REMEDIATION MANAGEMENT
            </span>

            <h2>
              AI Risk Action Tracker
            </h2>

            <p>
              Track accountable owners,
              deadlines, controls, risks and
              remediation progress.
            </p>
          </div>

          <div className="remediation-filters">
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search actions..."
            />

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Not started</option>
              <option>In progress</option>
              <option>Blocked</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="remediation-table-wrapper">
          <div className="remediation-table">
            <div className="remediation-row remediation-head">
              <span>ID</span>
              <span>Action</span>
              <span>Owner</span>
              <span>Priority</span>
              <span>Linked risks</span>
              <span>Controls</span>
              <span>Due date</span>
              <span>Status</span>
              <span>Progress</span>
              <span />
            </div>

            {filtered.map((action) => {
              const overdue =
                isOverdue(action);

              return (
                <div
                  className="remediation-row"
                  key={action.id}
                >
                  <strong className="remediation-id">
                    {action.id}
                  </strong>

                  <div className="remediation-title">
                    <strong>
                      {action.title}
                    </strong>

                    <span>
                      {action.description}
                    </span>
                  </div>

                  <span>
                    {action.owner}
                  </span>

                  <span
                    className={`priority-pill ${action.priority.toLowerCase()}`}
                  >
                    {action.priority}
                  </span>

                  <span className="linked-risk-count">
                    {
                      action.linkedRiskIds
                        .length
                    }{" "}
                    linked
                  </span>

                  <span className="linked-risk-count">
                    {
                      action
                        .linkedControlIds
                        .length
                    }{" "}
                    linked
                  </span>

                  <div>
                    <span
                      className={
                        overdue
                          ? "due-date overdue-date"
                          : "due-date"
                      }
                    >
                      {action.dueDate}
                    </span>

                    {overdue && (
                      <small className="overdue-label">
                        OVERDUE
                      </small>
                    )}
                  </div>

                  <span
                    className={`remediation-status-pill ${slug(
                      action.status
                    )}`}
                  >
                    {action.status}
                  </span>

                  <div className="progress-cell">
                    <div className="small-progress-track">
                      <div
                        style={{
                          width: `${action.progress}%`,
                        }}
                      />
                    </div>

                    <small>
                      {action.progress}%
                    </small>
                  </div>

                  <button
                    className="manage-risk-button"
                    onClick={() =>
                      setSelectedAction(
                        action
                      )
                    }
                  >
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="inventory-footer">
          Showing {filtered.length} of{" "}
          {actions.length} actions
        </div>
      </section>

      {selectedAction && (
        <ManageRemediationModal
          action={selectedAction}
          risks={risks}
          controls={controls}
          onClose={() =>
            setSelectedAction(null)
          }
          onSave={(updated) => {
            onUpdateAction(updated);
            setSelectedAction(null);
          }}
        />
      )}
    </>
  );
}

function ManageRemediationModal({
  action,
  risks,
  controls,
  onClose,
  onSave,
}: {
  action: RemediationAction;
  risks: RiskRecord[];
  controls: ControlRecord[];
  onClose: () => void;
  onSave: (
    action: RemediationAction
  ) => void;
}) {
  const [owner, setOwner] =
    useState(action.owner);

  const [priority, setPriority] =
    useState<Priority>(
      action.priority
    );

  const [status, setStatus] =
    useState<RemediationStatus>(
      action.status
    );

  const [dueDate, setDueDate] =
    useState(action.dueDate);

  const [progress, setProgress] =
    useState(action.progress);

  const [notes, setNotes] =
    useState(action.notes);

  const [
    linkedRiskIds,
    setLinkedRiskIds,
  ] = useState<string[]>(
    action.linkedRiskIds
  );

  const [
    linkedControlIds,
    setLinkedControlIds,
  ] = useState<string[]>(
    action.linkedControlIds
  );

  function toggleRisk(id: string) {
    setLinkedRiskIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function toggleControl(id: string) {
    setLinkedControlIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  function handleStatusChange(
    value: RemediationStatus
  ) {
    setStatus(value);

    if (value === "Completed") {
      setProgress(100);
    }

    if (
      value === "Not started" &&
      progress === 100
    ) {
      setProgress(0);
    }
  }

  function save(e: FormEvent) {
    e.preventDefault();

    let finalProgress = Math.min(
      100,
      Math.max(0, progress)
    );

    let finalStatus = status;

    if (finalStatus === "Completed") {
      finalProgress = 100;
    }

    if (
      finalProgress === 100 &&
      finalStatus !== "Completed"
    ) {
      finalStatus = "Completed";
    }

    onSave({
      ...action,
      owner,
      priority,
      status: finalStatus,
      dueDate,
      progress: finalProgress,
      linkedRiskIds,
      linkedControlIds,
      notes,
    });
  }

  return (
    <div className="modal-backdrop">
      <form
        className="remediation-modal"
        onSubmit={save}
      >
        <div className="modal-heading">
          <div>
            <span className="panel-label">
              REMEDIATION ACTION
            </span>

            <h2>{action.id}</h2>

            <p>{action.title}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="control-description-card">
          <span>
            Action objective
          </span>

          <p>
            {action.description}
          </p>
        </div>

        <div className="remediation-context">
          <div>
            <span>Linked risks</span>

            <strong>
              {linkedRiskIds.length}
            </strong>
          </div>

          <div>
            <span>Linked controls</span>

            <strong>
              {linkedControlIds.length}
            </strong>
          </div>

          <div>
            <span>Current progress</span>

            <strong>
              {progress}%
            </strong>
          </div>
        </div>

        <div className="modal-grid">
          <label>
            Action owner

            <input
              value={owner}
              onChange={(e) =>
                setOwner(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Priority

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target
                    .value as Priority
                )
              }
            >
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label>
            Status

            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(
                  e.target
                    .value as RemediationStatus
                )
              }
            >
              <option>
                Not started
              </option>
              <option>
                In progress
              </option>
              <option>Blocked</option>
              <option>Completed</option>
            </select>
          </label>

          <label>
            Target date

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <div className="progress-editor">
          <div>
            <strong>
              Completion progress
            </strong>

            <span>
              Update action completion from
              0–100%.
            </span>
          </div>

          <div className="progress-editor-controls">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) =>
                setProgress(
                  Number(
                    e.target.value
                  )
                )
              }
            />

            <strong>
              {progress}%
            </strong>
          </div>
        </div>

        <label className="evidence-field">
          Progress notes / evidence

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            placeholder="Document work completed, dependencies, evidence or blockers..."
          />
        </label>

        <div className="linked-risks-section">
          <span className="panel-label">
            LINKED RISKS
          </span>

          <h3>
            Risks addressed by this action
          </h3>

          <div className="risk-checkbox-list">
            {risks.map((risk) => (
              <label
                className="risk-checkbox-card"
                key={risk.id}
              >
                <input
                  type="checkbox"
                  checked={linkedRiskIds.includes(
                    risk.id
                  )}
                  onChange={() =>
                    toggleRisk(risk.id)
                  }
                />

                <div>
                  <strong>
                    {risk.id} ·{" "}
                    {risk.systemName}
                  </strong>

                  <span>
                    {risk.category} ·{" "}
                    {risk.risk} risk
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="linked-risks-section">
          <span className="panel-label">
            LINKED CONTROLS
          </span>

          <h3>
            Controls supporting remediation
          </h3>

          <div className="risk-checkbox-list">
            {controls.map((control) => (
              <label
                className="risk-checkbox-card"
                key={control.id}
              >
                <input
                  type="checkbox"
                  checked={linkedControlIds.includes(
                    control.id
                  )}
                  onChange={() =>
                    toggleControl(
                      control.id
                    )
                  }
                />

                <div>
                  <strong>
                    {control.id} ·{" "}
                    {control.name}
                  </strong>

                  <span>
                    {control.framework} ·{" "}
                    {control.status}
                  </span>
                </div>
              </label>
            ))}
          </div>
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
            type="submit"
            className="primary-small"
          >
            Save action
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- VENDORS ---------------- */

function VendorsModule({
  vendors,
  systems,
  onUpdateVendor,
}: {
  vendors: VendorRecord[];
  systems: AISystem[];
  onUpdateVendor: (
    vendor: VendorRecord
  ) => void;
}) {
  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedVendor,
    setSelectedVendor,
  ] =
    useState<VendorRecord | null>(
      null
    );

  const filtered = vendors.filter(
    (vendor) => {
      const score =
        getVendorRiskScore(vendor);

      const risk =
        getVendorRiskLevel(score);

      const q = search.toLowerCase();

      return (
        (vendor.id
          .toLowerCase()
          .includes(q) ||
          vendor.name
            .toLowerCase()
            .includes(q) ||
          vendor.service
            .toLowerCase()
            .includes(q) ||
          vendor.owner
            .toLowerCase()
            .includes(q)) &&
        (riskFilter === "All" ||
          risk === riskFilter) &&
        (statusFilter === "All" ||
          vendor.status === statusFilter)
      );
    }
  );

  const highRisk = vendors.filter(
    (vendor) => {
      const risk = getVendorRiskLevel(
        getVendorRiskScore(vendor)
      );

      return (
        risk === "High" ||
        risk === "Critical"
      );
    }
  ).length;

  const complete = vendors.filter(
    (vendor) =>
      vendor.dueDiligence ===
      "Complete"
  ).length;

  const issues = vendors.filter(
    (vendor) =>
      vendor.status !== "Approved"
  ).length;

  return (
    <>
      <section className="vendor-summary">
        <Metric
          label="External AI Vendors"
          value={String(
            vendors.length
          )}
          detail="Third-party providers"
        />

        <Metric
          label="High / Critical Risk"
          value={String(highRisk)}
          detail="Priority vendor exposure"
          alert
        />

        <Metric
          label="Due Diligence Complete"
          value={String(complete)}
          detail="Vendor reviews completed"
        />

        <Metric
          label="Approval Issues"
          value={String(issues)}
          detail="Conditional or review required"
          alert={issues > 0}
        />
      </section>

      <section className="vendors-panel">
        <div className="vendors-toolbar">
          <div>
            <span className="panel-label">
              THIRD-PARTY AI RISK
            </span>

            <h2>
              AI Vendor Risk Register
            </h2>

            <p>
              Assess external AI providers
              across security, privacy,
              resilience, compliance and
              dependency risk.
            </p>
          </div>

          <div className="vendors-filters">
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search vendors..."
            />

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Approved</option>
              <option>Conditional</option>
              <option>
                Review required
              </option>
              <option>Blocked</option>
            </select>
          </div>
        </div>

        <div className="vendors-table-wrapper">
          <div className="vendors-table">
            <div className="vendors-row vendors-head">
              <span>ID</span>
              <span>Vendor</span>
              <span>Linked systems</span>
              <span>Data processing</span>
              <span>Owner</span>
              <span>Due diligence</span>
              <span>Risk score</span>
              <span>Status</span>
              <span>Next review</span>
              <span />
            </div>

            {filtered.map((vendor) => {
              const score =
                getVendorRiskScore(
                  vendor
                );

              const risk =
                getVendorRiskLevel(
                  score
                );

              const linked =
                systems.filter(
                  (system) =>
                    system.vendor ===
                    vendor.name
                );

              return (
                <div
                  className="vendors-row"
                  key={vendor.id}
                >
                  <strong className="vendor-id">
                    {vendor.id}
                  </strong>

                  <div className="vendor-name">
                    <strong>
                      {vendor.name}
                    </strong>

                    <span>
                      {vendor.service}
                    </span>
                  </div>

                  <span className="linked-risk-count">
                    {linked.length} systems
                  </span>

                  <span>
                    {
                      vendor.dataProcessing
                    }
                  </span>

                  <span>
                    {vendor.owner}
                  </span>

                  <span
                    className={`dd-pill ${slug(
                      vendor.dueDiligence
                    )}`}
                  >
                    {
                      vendor.dueDiligence
                    }
                  </span>

                  <div>
                    <span
                      className={`risk-pill ${risk.toLowerCase()}`}
                    >
                      {risk}
                    </span>

                    <small className="score-small">
                      {score}/25
                    </small>
                  </div>

                  <span
                    className={`vendor-status-pill ${slug(
                      vendor.status
                    )}`}
                  >
                    {vendor.status}
                  </span>

                  <span>
                    {vendor.nextReview}
                  </span>

                  <button
                    className="manage-risk-button"
                    onClick={() =>
                      setSelectedVendor(
                        vendor
                      )
                    }
                  >
                    Assess
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="inventory-footer">
          Showing {filtered.length} of{" "}
          {vendors.length} vendors
        </div>
      </section>

      {selectedVendor && (
        <ManageVendorModal
          vendor={selectedVendor}
          systems={systems.filter(
            (system) =>
              system.vendor ===
              selectedVendor.name
          )}
          onClose={() =>
            setSelectedVendor(null)
          }
          onSave={(updated) => {
            onUpdateVendor(updated);
            setSelectedVendor(null);
          }}
        />
      )}
    </>
  );
}

function ManageVendorModal({
  vendor,
  systems,
  onClose,
  onSave,
}: {
  vendor: VendorRecord;
  systems: AISystem[];
  onClose: () => void;
  onSave: (
    vendor: VendorRecord
  ) => void;
}) {
  const [owner, setOwner] =
    useState(vendor.owner);

  const [status, setStatus] =
    useState<VendorStatus>(
      vendor.status
    );

  const [
    dueDiligence,
    setDueDiligence,
  ] =
    useState<DueDiligenceStatus>(
      vendor.dueDiligence
    );

  const [
    dataProcessing,
    setDataProcessing,
  ] = useState(
    vendor.dataProcessing
  );

  const [
    securityRisk,
    setSecurityRisk,
  ] = useState(
    vendor.securityRisk
  );

  const [
    privacyRisk,
    setPrivacyRisk,
  ] = useState(
    vendor.privacyRisk
  );

  const [
    resilienceRisk,
    setResilienceRisk,
  ] = useState(
    vendor.resilienceRisk
  );

  const [
    complianceRisk,
    setComplianceRisk,
  ] = useState(
    vendor.complianceRisk
  );

  const [
    dependencyRisk,
    setDependencyRisk,
  ] = useState(
    vendor.dependencyRisk
  );

  const [evidence, setEvidence] =
    useState(vendor.evidence);

  const [nextReview, setNextReview] =
    useState(vendor.nextReview);

  const preview: VendorRecord = {
    ...vendor,
    owner,
    status,
    dueDiligence,
    dataProcessing,
    securityRisk,
    privacyRisk,
    resilienceRisk,
    complianceRisk,
    dependencyRisk,
    evidence,
    nextReview,
  };

  const score =
    getVendorRiskScore(preview);

  const risk =
    getVendorRiskLevel(score);

  return (
    <div className="modal-backdrop">
      <form
        className="vendor-modal"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(preview);
        }}
      >
        <div className="modal-heading">
          <div>
            <span className="panel-label">
              THIRD-PARTY AI RISK
            </span>

            <h2>{vendor.name}</h2>

            <p>
              {vendor.id} ·{" "}
              {vendor.service}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="vendor-risk-hero">
          <div>
            <span>
              Vendor risk score
            </span>

            <strong>{score}</strong>
            <small>/25</small>
          </div>

          <span
            className={`result-risk-label ${risk.toLowerCase()}`}
          >
            {risk} Risk
          </span>
        </div>

        <div className="vendor-linked-systems">
          <span className="panel-label">
            LINKED AI SYSTEMS
          </span>

          <div className="vendor-system-chips">
            {systems.length ? (
              systems.map((system) => (
                <span key={system.id}>
                  {system.name} ·{" "}
                  {system.department}
                </span>
              ))
            ) : (
              <span>
                No linked systems
              </span>
            )}
          </div>
        </div>

        <div className="modal-grid">
          <label>
            Vendor owner

            <input
              value={owner}
              onChange={(e) =>
                setOwner(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Approval status

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as VendorStatus
                )
              }
            >
              <option>Approved</option>
              <option>Conditional</option>
              <option>
                Review required
              </option>
              <option>Blocked</option>
            </select>
          </label>

          <label>
            Due diligence

            <select
              value={dueDiligence}
              onChange={(e) =>
                setDueDiligence(
                  e.target
                    .value as DueDiligenceStatus
                )
              }
            >
              <option>Complete</option>
              <option>Partial</option>
              <option>Not started</option>
            </select>
          </label>

          <label>
            Next review date

            <input
              type="date"
              value={nextReview}
              onChange={(e) =>
                setNextReview(
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <label className="evidence-field">
          Data processed by vendor

          <textarea
            value={dataProcessing}
            onChange={(e) =>
              setDataProcessing(
                e.target.value
              )
            }
          />
        </label>

        <div className="vendor-risk-factors">
          <span className="panel-label">
            RISK FACTORS
          </span>

          <h3>
            Score each area from 1
            (low) to 5 (very high)
          </h3>

          <VendorRiskFactor
            label="Cybersecurity risk"
            value={securityRisk}
            onChange={setSecurityRisk}
          />

          <VendorRiskFactor
            label="Privacy & data risk"
            value={privacyRisk}
            onChange={setPrivacyRisk}
          />

          <VendorRiskFactor
            label="Operational resilience"
            value={resilienceRisk}
            onChange={setResilienceRisk}
          />

          <VendorRiskFactor
            label="Compliance risk"
            value={complianceRisk}
            onChange={setComplianceRisk}
          />

          <VendorRiskFactor
            label="Concentration dependency"
            value={dependencyRisk}
            onChange={setDependencyRisk}
          />
        </div>

        <label className="evidence-field">
          Due diligence evidence / notes

          <textarea
            value={evidence}
            onChange={(e) =>
              setEvidence(
                e.target.value
              )
            }
          />
        </label>

        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-small"
          >
            Save vendor assessment
          </button>
        </div>
      </form>
    </div>
  );
}

function VendorRiskFactor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="vendor-factor">
      <strong>{label}</strong>

      <div className="vendor-score-options">
        {[1, 2, 3, 4, 5].map(
          (score) => (
            <button
              type="button"
              key={score}
              className={
                value === score
                  ? "vendor-score selected"
                  : "vendor-score"
              }
              onClick={() =>
                onChange(score)
              }
            >
              {score}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ---------------- CONTROLS ---------------- */

function ControlsLibrary({
  controls,
  risks,
  onUpdateControl,
}: {
  controls: ControlRecord[];
  risks: RiskRecord[];
  onUpdateControl: (
    control: ControlRecord
  ) => void;
}) {
  const [search, setSearch] =
    useState("");

  const [
    frameworkFilter,
    setFrameworkFilter,
  ] = useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedControl,
    setSelectedControl,
  ] =
    useState<ControlRecord | null>(
      null
    );

  const filtered = controls.filter(
    (control) => {
      const q = search.toLowerCase();

      return (
        (control.id
          .toLowerCase()
          .includes(q) ||
          control.name
            .toLowerCase()
            .includes(q) ||
          control.category
            .toLowerCase()
            .includes(q) ||
          control.owner
            .toLowerCase()
            .includes(q)) &&
        (frameworkFilter === "All" ||
          control.framework ===
            frameworkFilter) &&
        (statusFilter === "All" ||
          control.status ===
            statusFilter)
      );
    }
  );

  return (
    <>
      <section className="control-summary">
        <Metric
          label="Control Library"
          value={String(
            controls.length
          )}
          detail="AI governance controls"
        />

        <Metric
          label="Implemented"
          value={String(
            controls.filter(
              (control) =>
                control.status ===
                "Implemented"
            ).length
          )}
          detail={`${calculateControlCoverage(
            controls
          )}% weighted coverage`}
        />

        <Metric
          label="Effective"
          value={String(
            controls.filter(
              (control) =>
                control.effectiveness ===
                "Effective"
            ).length
          )}
          detail="Validated controls"
        />

        <Metric
          label="Evidence Gaps"
          value={String(
            controls.filter(
              (control) =>
                !control.evidence.trim() ||
                control.evidence ===
                  "Not uploaded"
            ).length
          )}
          detail="Evidence still required"
        />
      </section>

      <section className="controls-panel">
        <div className="controls-toolbar">
          <div>
            <span className="panel-label">
              CONTROL ASSURANCE
            </span>

            <h2>
              AI Governance Control Library
            </h2>

            <p>
              Map controls to NIST AI RMF,
              risks, owners, evidence and
              operating effectiveness.
            </p>
          </div>

          <div className="controls-filters">
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search controls..."
            />

            <select
              value={frameworkFilter}
              onChange={(e) =>
                setFrameworkFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Govern</option>
              <option>Map</option>
              <option>Measure</option>
              <option>Manage</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Implemented</option>
              <option>Partial</option>
              <option>Planned</option>
              <option>
                Not implemented
              </option>
            </select>
          </div>
        </div>

        <div className="controls-table-wrapper">
          <div className="controls-table">
            <div className="controls-row controls-head">
              <span>ID</span>
              <span>Control</span>
              <span>NIST AI RMF</span>
              <span>Category</span>
              <span>Owner</span>
              <span>Linked risks</span>
              <span>Status</span>
              <span>Effectiveness</span>
              <span>Review</span>
              <span />
            </div>

            {filtered.map((control) => (
              <div
                className="controls-row"
                key={control.id}
              >
                <strong className="control-id">
                  {control.id}
                </strong>

                <div className="control-name">
                  <strong>
                    {control.name}
                  </strong>

                  <span>
                    {control.description}
                  </span>
                </div>

                <span className="framework-control-pill">
                  {control.framework}
                </span>

                <span>
                  {control.category}
                </span>

                <span>
                  {control.owner}
                </span>

                <span className="linked-risk-count">
                  {
                    control.linkedRiskIds
                      .length
                  }{" "}
                  linked
                </span>

                <span
                  className={`control-status-pill ${slug(
                    control.status
                  )}`}
                >
                  {control.status}
                </span>

                <span
                  className={`effectiveness-pill ${slug(
                    control.effectiveness
                  )}`}
                >
                  {
                    control.effectiveness
                  }
                </span>

                <span>
                  {control.reviewDate}
                </span>

                <button
                  className="manage-risk-button"
                  onClick={() =>
                    setSelectedControl(
                      control
                    )
                  }
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedControl && (
        <ManageControlModal
          control={selectedControl}
          risks={risks}
          onClose={() =>
            setSelectedControl(null)
          }
          onSave={(updated) => {
            onUpdateControl(updated);
            setSelectedControl(null);
          }}
        />
      )}
    </>
  );
}

function ManageControlModal({
  control,
  risks,
  onClose,
  onSave,
}: {
  control: ControlRecord;
  risks: RiskRecord[];
  onClose: () => void;
  onSave: (
    control: ControlRecord
  ) => void;
}) {
  const [owner, setOwner] =
    useState(control.owner);

  const [status, setStatus] =
    useState<ControlStatus>(
      control.status
    );

  const [
    effectiveness,
    setEffectiveness,
  ] =
    useState<ControlEffectiveness>(
      control.effectiveness
    );

  const [evidence, setEvidence] =
    useState(control.evidence);

  const [reviewDate, setReviewDate] =
    useState(control.reviewDate);

  const [
    linkedRiskIds,
    setLinkedRiskIds,
  ] = useState<string[]>(
    control.linkedRiskIds
  );

  function toggleRisk(id: string) {
    setLinkedRiskIds((current) =>
      current.includes(id)
        ? current.filter(
            (item) => item !== id
          )
        : [...current, id]
    );
  }

  return (
    <div className="modal-backdrop">
      <form
        className="control-modal"
        onSubmit={(e) => {
          e.preventDefault();

          onSave({
            ...control,
            owner,
            status,
            effectiveness,
            evidence,
            reviewDate,
            linkedRiskIds,
          });
        }}
      >
        <div className="modal-heading">
          <div>
            <span className="panel-label">
              CONTROL ASSURANCE
            </span>

            <h2>{control.id}</h2>
            <p>{control.name}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="control-description-card">
          <span>Control objective</span>
          <p>{control.description}</p>
        </div>

        <div className="modal-grid">
          <label>
            Control owner

            <input
              value={owner}
              onChange={(e) =>
                setOwner(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Implementation status

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as ControlStatus
                )
              }
            >
              <option>Implemented</option>
              <option>Partial</option>
              <option>Planned</option>
              <option>
                Not implemented
              </option>
            </select>
          </label>

          <label>
            Effectiveness

            <select
              value={effectiveness}
              onChange={(e) =>
                setEffectiveness(
                  e.target
                    .value as ControlEffectiveness
                )
              }
            >
              <option>Effective</option>
              <option>
                Partially effective
              </option>
              <option>Not tested</option>
              <option>Ineffective</option>
            </select>
          </label>

          <label>
            Next review date

            <input
              type="date"
              value={reviewDate}
              onChange={(e) =>
                setReviewDate(
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <label className="evidence-field">
          Evidence / assurance notes

          <textarea
            value={evidence}
            onChange={(e) =>
              setEvidence(
                e.target.value
              )
            }
          />
        </label>

        <div className="linked-risks-section">
          <span className="panel-label">
            LINKED RISKS
          </span>

          <div className="risk-checkbox-list">
            {risks.map((risk) => (
              <label
                className="risk-checkbox-card"
                key={risk.id}
              >
                <input
                  type="checkbox"
                  checked={linkedRiskIds.includes(
                    risk.id
                  )}
                  onChange={() =>
                    toggleRisk(risk.id)
                  }
                />

                <div>
                  <strong>
                    {risk.id} ·{" "}
                    {risk.systemName}
                  </strong>

                  <span>
                    {risk.category}
                  </span>
                </div>
              </label>
            ))}
          </div>
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
            Save control
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- RISK REGISTER ---------------- */

function RiskRegister({
  risks,
  onUpdateRisk,
}: {
  risks: RiskRecord[];
  onUpdateRisk: (
    risk: RiskRecord
  ) => void;
}) {
  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [
    selectedRisk,
    setSelectedRisk,
  ] =
    useState<RiskRecord | null>(
      null
    );

  const filtered = risks.filter(
    (risk) => {
      const q = search.toLowerCase();

      return (
        (risk.id
          .toLowerCase()
          .includes(q) ||
          risk.systemName
            .toLowerCase()
            .includes(q) ||
          risk.category
            .toLowerCase()
            .includes(q) ||
          risk.owner
            .toLowerCase()
            .includes(q)) &&
        (riskFilter === "All" ||
          risk.risk === riskFilter) &&
        (statusFilter === "All" ||
          risk.status === statusFilter)
      );
    }
  );

  return (
    <>
      <section className="risk-register-summary">
        <Metric
          label="Total Risks"
          value={String(risks.length)}
          detail="Registered AI risks"
        />

        <Metric
          label="High / Critical"
          value={String(
            risks.filter(
              (risk) =>
                risk.risk === "High" ||
                risk.risk === "Critical"
            ).length
          )}
          detail="Priority exposure"
          alert
        />

        <Metric
          label="In Progress"
          value={String(
            risks.filter(
              (risk) =>
                risk.status ===
                "In progress"
            ).length
          )}
          detail="Treatment underway"
        />

        <Metric
          label="Closed"
          value={String(
            risks.filter(
              (risk) =>
                risk.status ===
                "Closed"
            ).length
          )}
          detail="Risk treatment completed"
        />
      </section>

      <section className="risk-register-panel">
        <div className="risk-register-toolbar">
          <div>
            <span className="panel-label">
              ENTERPRISE RISK REGISTER
            </span>

            <h2>AI Risk Register</h2>

            <p>
              Track inherent risk,
              ownership, treatment decisions
              and residual exposure.
            </p>
          </div>

          <div className="risk-register-filters">
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search risks..."
            />

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option>All</option>
              <option>Open</option>
              <option>
                In progress
              </option>
              <option>Accepted</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="risk-register-table-wrapper">
          <div className="risk-register-table">
            <div className="risk-register-row risk-register-head">
              <span>ID</span>
              <span>AI system</span>
              <span>Category</span>
              <span>Owner</span>
              <span>Inherent</span>
              <span>Treatment</span>
              <span>Status</span>
              <span>Residual</span>
              <span />
            </div>

            {filtered.map((risk) => (
              <div
                className="risk-register-row"
                key={risk.id}
              >
                <strong className="risk-id">
                  {risk.id}
                </strong>

                <div className="risk-system">
                  <strong>
                    {risk.systemName}
                  </strong>

                  <span>
                    {risk.statement}
                  </span>
                </div>

                <span>
                  {risk.category}
                </span>

                <span>
                  {risk.owner}
                </span>

                <div>
                  <span
                    className={`risk-pill ${risk.risk.toLowerCase()}`}
                  >
                    {risk.risk}
                  </span>

                  <small className="score-small">
                    {risk.score}/25
                  </small>
                </div>

                <span className="treatment-pill">
                  {risk.treatment}
                </span>

                <span
                  className={`status-pill ${slug(
                    risk.status
                  )}`}
                >
                  {risk.status}
                </span>

                <div>
                  <span
                    className={`risk-pill ${risk.residualRisk.toLowerCase()}`}
                  >
                    {risk.residualRisk}
                  </span>

                  <small className="score-small">
                    {risk.residualScore}/25
                  </small>
                </div>

                <button
                  className="manage-risk-button"
                  onClick={() =>
                    setSelectedRisk(
                      risk
                    )
                  }
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedRisk && (
        <ManageRiskModal
          risk={selectedRisk}
          onClose={() =>
            setSelectedRisk(null)
          }
          onSave={(updated) => {
            onUpdateRisk(updated);
            setSelectedRisk(null);
          }}
        />
      )}
    </>
  );
}

function ManageRiskModal({
  risk,
  onClose,
  onSave,
}: {
  risk: RiskRecord;
  onClose: () => void;
  onSave: (
    risk: RiskRecord
  ) => void;
}) {
  const [owner, setOwner] =
    useState(risk.owner);

  const [treatment, setTreatment] =
    useState(risk.treatment);

  const [status, setStatus] =
    useState(risk.status);

  const [
    residualScore,
    setResidualScore,
  ] = useState(
    String(risk.residualScore)
  );

  return (
    <div className="modal-backdrop">
      <form
        className="risk-modal"
        onSubmit={(e) => {
          e.preventDefault();

          const score = Math.min(
            25,
            Math.max(
              1,
              Number(
                residualScore
              ) || 1
            )
          );

          onSave({
            ...risk,
            owner,
            treatment,
            status,
            residualScore: score,
            residualRisk:
              getRiskLevel(score),
          });
        }}
      >
        <div className="modal-heading">
          <div>
            <span className="panel-label">
              RISK TREATMENT
            </span>

            <h2>{risk.id}</h2>
            <p>{risk.systemName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="risk-modal-statement">
          <span>Risk statement</span>
          <p>{risk.statement}</p>
        </div>

        <div className="modal-grid">
          <label>
            Risk owner

            <input
              value={owner}
              onChange={(e) =>
                setOwner(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Treatment

            <select
              value={treatment}
              onChange={(e) =>
                setTreatment(
                  e.target.value
                )
              }
            >
              <option>Mitigate</option>
              <option>Monitor</option>
              <option>Accept</option>
              <option>Avoid</option>
              <option>Transfer</option>
            </select>
          </label>

          <label>
            Status

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >
              <option>Open</option>
              <option>
                In progress
              </option>
              <option>Accepted</option>
              <option>Closed</option>
            </select>
          </label>

          <label>
            Residual score

            <input
              type="number"
              min="1"
              max="25"
              value={residualScore}
              onChange={(e) =>
                setResidualScore(
                  e.target.value
                )
              }
            />
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
            type="submit"
            className="primary-small"
          >
            Save risk
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- ASSESSMENTS ---------------- */

function RiskAssessments({
  systems,
  assessments,
  onAssessmentComplete,
}: {
  systems: AISystem[];
  assessments: AssessmentResult[];
  onAssessmentComplete: (
    result: AssessmentResult
  ) => void;
}) {
  const [
    selectedSystemId,
    setSelectedSystemId,
  ] = useState<number>(
    systems[0]?.id ?? 0
  );

  const [answers, setAnswers] =
    useState<Record<string, number>>({});

  const [result, setResult] =
    useState<AssessmentResult | null>(
      null
    );

  const selectedSystem =
    systems.find(
      (system) =>
        system.id ===
        selectedSystemId
    );

  const answeredCount =
    Object.keys(answers).length;

  const completion = Math.round(
    (answeredCount /
      assessmentQuestions.length) *
      100
  );

  function calculateAssessment() {
    if (!selectedSystem) return;

    if (
      answeredCount !==
      assessmentQuestions.length
    ) {
      alert(
        "Please answer all assessment questions first."
      );
      return;
    }

    const likelihoodValues =
      assessmentQuestions
        .filter(
          (q) =>
            q.dimension ===
            "likelihood"
        )
        .map(
          (q) => answers[q.id]
        );

    const impactValues =
      assessmentQuestions
        .filter(
          (q) =>
            q.dimension ===
            "impact"
        )
        .map(
          (q) => answers[q.id]
        );

    const likelihood =
      likelihoodValues.reduce(
        (a, b) => a + b,
        0
      ) /
      likelihoodValues.length;

    const impact =
      impactValues.reduce(
        (a, b) => a + b,
        0
      ) /
      impactValues.length;

    const score = Math.round(
      likelihood * impact
    );

    const frameworkNames = [
      "Govern",
      "Map",
      "Measure",
      "Manage",
    ] as const;

    const framework =
      frameworkNames.reduce(
        (
          output,
          frameworkName
        ) => {
          const questions =
            assessmentQuestions.filter(
              (q) =>
                q.framework ===
                frameworkName
            );

          const average =
            questions.reduce(
              (sum, q) =>
                sum +
                answers[q.id],
              0
            ) / questions.length;

          output[frameworkName] =
            Math.round(
              100 -
                ((average - 1) /
                  4) *
                  75
            );

          return output;
        },
        {
          Govern: 0,
          Map: 0,
          Measure: 0,
          Manage: 0,
        }
      );

    const newResult: AssessmentResult =
      {
        id: Date.now(),
        systemId:
          selectedSystem.id,
        systemName:
          selectedSystem.name,
        date: new Date().toLocaleDateString(),
        likelihood: Number(
          likelihood.toFixed(1)
        ),
        impact: Number(
          impact.toFixed(1)
        ),
        score,
        risk: getRiskLevel(score),
        framework,
      };

    setResult(newResult);
    onAssessmentComplete(
      newResult
    );
  }

  return (
    <>
      <section className="assessment-top-grid">
        <div className="assessment-intro">
          <span className="panel-label">
            AI RISK ASSESSMENT
          </span>

          <h2>
            Assess AI System Risk
          </h2>

          <p>
            Evaluate business impact,
            cybersecurity, governance,
            third-party dependency and model
            reliability.
          </p>
        </div>

        <div className="assessment-progress-card">
          <div>
            <span>
              Assessment progress
            </span>

            <strong>
              {completion}%
            </strong>
          </div>

          <div className="assessment-progress-track">
            <div
              style={{
                width: `${completion}%`,
              }}
            />
          </div>
        </div>
      </section>

      {!result ? (
        <section className="assessment-layout">
          <div className="assessment-form-panel">
            <div className="assessment-system-selector">
              <h3>
                Select AI System
              </h3>

              <select
                value={selectedSystemId}
                onChange={(e) => {
                  setSelectedSystemId(
                    Number(
                      e.target.value
                    )
                  );

                  setAnswers({});
                }}
              >
                {systems.map(
                  (system) => (
                    <option
                      key={system.id}
                      value={system.id}
                    >
                      {system.name} ·{" "}
                      {
                        system.department
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="question-list">
              {assessmentQuestions.map(
                (
                  question,
                  index
                ) => (
                  <div
                    className="assessment-question"
                    key={
                      question.id
                    }
                  >
                    <div className="question-number">
                      {index + 1}
                    </div>

                    <div className="question-content">
                      <div className="question-heading">
                        <div>
                          <h3>
                            {
                              question.title
                            }
                          </h3>

                          <p>
                            {
                              question.description
                            }
                          </p>
                        </div>

                        <span className="framework-badge">
                          {
                            question.framework
                          }
                        </span>
                      </div>

                      <div className="risk-scale">
                        {[
                          1, 2, 3, 4, 5,
                        ].map(
                          (scoreValue) => (
                            <button
                              type="button"
                              key={
                                scoreValue
                              }
                              className={
                                answers[
                                  question.id
                                ] ===
                                scoreValue
                                  ? "scale-option selected"
                                  : "scale-option"
                              }
                              onClick={() =>
                                setAnswers(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    [question.id]:
                                      scoreValue,
                                  })
                                )
                              }
                            >
                              <strong>
                                {
                                  scoreValue
                                }
                              </strong>
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
              <span>
                Complete all questions to
                generate risk.
              </span>

              <button
                className="primary-small"
                onClick={
                  calculateAssessment
                }
              >
                Calculate risk
              </button>
            </div>
          </div>

          <aside className="assessment-methodology">
            <span className="panel-label">
              METHODOLOGY
            </span>

            <h3>
              Likelihood × Impact
            </h3>

            <MethodLevel
              risk="Low"
              score="1–4"
            />

            <MethodLevel
              risk="Medium"
              score="5–9"
            />

            <MethodLevel
              risk="High"
              score="10–16"
            />

            <MethodLevel
              risk="Critical"
              score="17–25"
            />
          </aside>
        </section>
      ) : (
        <AssessmentResultView
          result={result}
          onNewAssessment={() => {
            setResult(null);
            setAnswers({});
          }}
        />
      )}

      {assessments.length > 0 && (
        <section className="assessment-history-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                ASSESSMENT HISTORY
              </span>

              <h2>
                Completed Assessments
              </h2>
            </div>
          </div>

          {assessments.map(
            (assessment) => (
              <div
                className="assessment-history-row"
                key={
                  assessment.id
                }
              >
                <strong>
                  {
                    assessment.systemName
                  }
                </strong>

                <span>
                  {assessment.date}
                </span>

                <span>
                  {
                    assessment.likelihood
                  }
                  /5
                </span>

                <span>
                  {assessment.impact}/5
                </span>

                <span>
                  {assessment.score}/25
                </span>

                <span
                  className={`risk-pill ${assessment.risk.toLowerCase()}`}
                >
                  {assessment.risk}
                </span>
              </div>
            )
          )}
        </section>
      )}
    </>
  );
}

function MethodLevel({
  risk,
  score,
}: {
  risk: RiskLevel;
  score: string;
}) {
  return (
    <div className="methodology-level">
      <span
        className={`risk-dot ${risk.toLowerCase()}`}
      />

      <div>
        <strong>{risk}</strong>
        <small>{score}</small>
      </div>
    </div>
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

          <h2>
            {result.systemName}
          </h2>
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
          <span>
            Overall risk score
          </span>

          <strong>
            {result.score}
          </strong>

          <small>/25</small>

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
              {result.likelihood}/5
            </strong>
          </div>

          <div>
            <span>Impact</span>

            <strong>
              {result.impact}/5
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- INVENTORY ---------------- */

function AIInventory({
  systems,
}: {
  systems: AISystem[];
}) {
  const [search, setSearch] =
    useState("");

  const [riskFilter, setRiskFilter] =
    useState("All");

  const filtered = systems.filter(
    (system) => {
      const q = search.toLowerCase();

      return (
        (system.name
          .toLowerCase()
          .includes(q) ||
          system.department
            .toLowerCase()
            .includes(q) ||
          system.vendor
            .toLowerCase()
            .includes(q)) &&
        (riskFilter === "All" ||
          system.risk === riskFilter)
      );
    }
  );

  return (
    <>
      <section className="inventory-summary">
        <Metric
          label="Registered AI Systems"
          value={String(
            systems.length
          )}
          detail="Enterprise inventory"
        />

        <Metric
          label="High / Critical Risk"
          value={String(
            systems.filter(
              (system) =>
                system.risk === "High" ||
                system.risk ===
                  "Critical"
            ).length
          )}
          detail="Requires attention"
          alert
        />

        <Metric
          label="Departments"
          value={String(
            new Set(
              systems.map(
                (system) =>
                  system.department
              )
            ).size
          )}
          detail="Using AI systems"
        />

        <Metric
          label="Reviews Due"
          value={String(
            systems.filter(
              (system) =>
                system.status ===
                  "Review required" ||
                system.status ===
                  "Assessment due"
            ).length
          )}
          detail="Governance actions required"
        />
      </section>

      <section className="inventory-panel">
        <div className="inventory-toolbar">
          <div>
            <span className="panel-label">
              AI ASSET INVENTORY
            </span>

            <h2>
              Enterprise AI Systems
            </h2>
          </div>

          <div className="inventory-filters">
            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search systems..."
            />

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
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

            {filtered.map(
              (system) => (
                <div
                  className="inventory-row"
                  key={
                    system.id
                  }
                >
                  <strong>
                    {system.name}
                  </strong>

                  <span>
                    {
                      system.department
                    }
                  </span>

                  <span>
                    {system.vendor}
                  </span>

                  <span>
                    {system.owner}
                  </span>

                  <span className="data-pill">
                    {
                      system.dataSensitivity
                    }
                  </span>

                  <span
                    className={`risk-pill ${system.risk.toLowerCase()}`}
                  >
                    {system.risk}
                  </span>

                  <span>
                    {system.status}
                  </span>
                </div>
              )
            )}
          </div>
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
  onAdd: (
    system: AISystem
  ) => void;
}) {
  const [name, setName] =
    useState("");

  const [
    department,
    setDepartment,
  ] = useState("");

  const [owner, setOwner] =
    useState("");

  const [vendor, setVendor] =
    useState("");

  const [
    dataSensitivity,
    setDataSensitivity,
  ] = useState("Internal");

  const [
    criticality,
    setCriticality,
  ] = useState("Medium");

  return (
    <div className="modal-backdrop">
      <form
        className="system-modal"
        onSubmit={(e) => {
          e.preventDefault();

          if (
            !name ||
            !department ||
            !owner ||
            !vendor
          )
            return;

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
        }}
      >
        <div className="modal-heading">
          <h2>
            Register AI System
          </h2>

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
                setName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Department

            <input
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Owner

            <input
              value={owner}
              onChange={(e) =>
                setOwner(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Vendor

            <input
              value={vendor}
              onChange={(e) =>
                setVendor(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Data sensitivity

            <select
              value={
                dataSensitivity
              }
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
            Criticality

            <select
              value={criticality}
              onChange={(e) =>
                setCriticality(
                  e.target.value
                )
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

/* ---------------- SHARED ---------------- */

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
        className={
          alert
            ? "alert-value"
            : ""
        }
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
          style={{
            width: `${width}%`,
          }}
        />
      </div>

      <strong>{value}</strong>
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