import { Report, Project } from "./types";

export const MOCK_REPORTS: Report[] = [
  {
    id: "r1",
    userId: "u1",
    userName: "Nadia Okafor",
    weekRange: "Jun 30 – Jul 6, 2026",
    project: "Client Portal",
    tasksCompleted: [
      "Redesigned login flow",
      "Fixed API auth bug",
      "Reviewed 4 pull requests",
      "Updated component library"
    ],
    tasksPlanned: [
      "Implement 2FA",
      "Dashboard v2 prototype",
      "Write unit tests"
    ],
    blockers: "Waiting on design assets from brand team",
    hoursWorked: 42,
    notes: "Good sprint overall, team velocity improving.",
    status: "submitted",
    submittedAt: "Jul 6, 2026"
  },
  {
    id: "r2",
    userId: "u2",
    userName: "Marcus Chen",
    weekRange: "Jun 30 – Jul 6, 2026",
    project: "Internal Tooling",
    tasksCompleted: [
      "CI/CD pipeline upgrade",
      "Linting config overhaul",
      "Migrated legacy scripts"
    ],
    tasksPlanned: ["Deploy staging env", "Write integration tests"],
    blockers: "None",
    hoursWorked: 38,
    notes: "Pipeline is now 40% faster.",
    status: "submitted",
    submittedAt: "Jul 6, 2026"
  },
  {
    id: "r3",
    userId: "u3",
    userName: "Sofia Reyes",
    weekRange: "Jun 30 – Jul 6, 2026",
    project: "R&D",
    tasksCompleted: [
      "Lit review on LLM embeddings",
      "Prototype RAG pipeline",
      "Benchmarked three models"
    ],
    tasksPlanned: [
      "Benchmark against baseline",
      "Document findings",
      "Present to team"
    ],
    blockers: "GPU quota limit on cloud provider",
    hoursWorked: 44,
    notes: "Promising early results on retrieval quality.",
    status: "submitted",
    submittedAt: "Jul 5, 2026"
  },
  {
    id: "r4",
    userId: "u4",
    userName: "James Osei",
    weekRange: "Jun 30 – Jul 6, 2026",
    project: "Marketing",
    tasksCompleted: [],
    tasksPlanned: ["Q3 campaign brief", "Landing page copy"],
    blockers: "Unclear brief from stakeholders",
    hoursWorked: 0,
    notes: "",
    status: "late",
    submittedAt: ""
  },
  {
    id: "r5",
    userId: "u5",
    userName: "Priya Nair",
    weekRange: "Jun 30 – Jul 6, 2026",
    project: "Client Portal",
    tasksCompleted: ["QA regression suite", "Accessibility audit"],
    tasksPlanned: ["Performance testing", "Load test report"],
    blockers: "Staging environment unstable",
    hoursWorked: 36,
    notes: "Found 3 critical accessibility issues.",
    status: "pending",
    submittedAt: ""
  }
];

export const MEMBER_HISTORY: Report[] = [
  {
    id: "h1",
    userId: "u1",
    userName: "Nadia Okafor",
    weekRange: "Jun 23 – Jun 29, 2026",
    project: "Client Portal",
    tasksCompleted: ["Auth flow redesign", "API integration", "Code review"],
    tasksPlanned: ["Login redesign", "Fix auth bug"],
    blockers: "None",
    hoursWorked: 40,
    notes: "Solid week.",
    status: "submitted",
    submittedAt: "Jun 29, 2026"
  },
  {
    id: "h2",
    userId: "u1",
    userName: "Nadia Okafor",
    weekRange: "Jun 16 – Jun 22, 2026",
    project: "R&D",
    tasksCompleted: ["Research spike", "POC demo"],
    tasksPlanned: ["Auth flow redesign"],
    blockers: "Unclear requirements",
    hoursWorked: 37,
    notes: "",
    status: "submitted",
    submittedAt: "Jun 22, 2026"
  },
  {
    id: "h3",
    userId: "u1",
    userName: "Nadia Okafor",
    weekRange: "Jun 9 – Jun 15, 2026",
    project: "Client Portal",
    tasksCompleted: ["Ticket triage", "Bug fixes"],
    tasksPlanned: ["Research spike"],
    blockers: "None",
    hoursWorked: 41,
    notes: "",
    status: "submitted",
    submittedAt: "Jun 15, 2026"
  }
];

export const ALL_MY_REPORTS = [MOCK_REPORTS[0], ...MEMBER_HISTORY];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Client Portal",
    color: "#4f7bff",
    glow: "rgba(79,123,255,0.3)",
    members: 3,
    reports: 12,
    category: "Product",
    progress: 78,
    lead: "Nadia Okafor",
    due: "Aug 15, 2026"
  },
  {
    id: "p2",
    name: "Internal Tooling",
    color: "#22d3a5",
    glow: "rgba(34,211,165,0.3)",
    members: 2,
    reports: 8,
    category: "Engineering",
    progress: 55,
    lead: "Marcus Chen",
    due: "Sep 1, 2026"
  },
  {
    id: "p3",
    name: "R&D",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    members: 2,
    reports: 6,
    category: "Research",
    progress: 30,
    lead: "Sofia Reyes",
    due: "Oct 30, 2026"
  },
  {
    id: "p4",
    name: "Marketing",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    members: 2,
    reports: 4,
    category: "Marketing",
    progress: 20,
    lead: "James Osei",
    due: "Jul 31, 2026"
  }
];

export const TREND_DATA = [
  { week: "W1", tasks: 18, hours: 38 },
  { week: "W2", tasks: 24, hours: 41 },
  { week: "W3", tasks: 21, hours: 39 },
  { week: "W4", tasks: 29, hours: 44 },
  { week: "W5", tasks: 26, hours: 42 },
  { week: "W6", tasks: 34, hours: 46 }
];

export const MEMBER_HOURS = [
  { name: "Nadia", hours: 42, tasks: 11, color: "#4f7bff" },
  { name: "Marcus", hours: 38, tasks: 7, color: "#22d3a5" },
  { name: "Sofia", hours: 44, tasks: 10, color: "#a78bfa" },
  { name: "James", hours: 0, tasks: 0, color: "#f59e0b" },
  { name: "Priya", hours: 36, tasks: 6, color: "#f472b6" }
];

export const COMPLIANCE_DATA = [
  { name: "Submitted", value: 3, color: "#4f7bff" },
  { name: "Pending", value: 1, color: "#f59e0b" },
  { name: "Late", value: 1, color: "#ff5370" }
];

export const RADIAL_DATA = [
  { name: "Compliance", value: 60, fill: "#4f7bff" }
];
