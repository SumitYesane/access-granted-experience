export type EducationMatrixEntry = {
  id: string;
  node: string;
  type: string;
  issuer: string;
  completionDate: string;
  focusAreas: string[];
  credentialId: string;
  score: string;
  state: "complete" | "active";
};

export const educationMatrixEntries: EducationMatrixEntry[] = [
  {
    id: "msc-ai",
    node: "M.Sc. in AI",
    type: "DEGREE",
    issuer: "University X",
    completionDate: "[Q2 2023]",
    focusAreas: ["Deep Learning", "Distributed Compute", "Neural Architecture"],
    credentialId: "AC-994821",
    score: "GPA: 8.5/10",
    state: "complete",
  },
  {
    id: "btech-cs",
    node: "B.Tech. in CS",
    type: "DEGREE",
    issuer: "University Y",
    completionDate: "[Q4 2020]",
    focusAreas: ["Data Structures", "Operating Systems", "Database Systems"],
    credentialId: "BC-220741",
    score: "CGPA: 8.2/10",
    state: "complete",
  },
  {
    id: "mlops-architect",
    node: "MLOps Architect",
    type: "CERT",
    issuer: "Coursera/AWS",
    completionDate: "[Q1 2024]",
    focusAreas: ["Model Delivery", "Cloud Pipelines", "Observability"],
    credentialId: "CT-883401",
    score: "Verified",
    state: "active",
  },
];

export const educationMatrixGhostRows = [
  { id: "ghost-1", node: "...", type: "...", issuer: "...", completionDate: "..." },
  { id: "ghost-2", node: "...", type: "...", issuer: "...", completionDate: "..." },
];

export const educationBadges = [
  { id: "badge-1", label: "AI", hue: "education-matrix__badge--violet" },
  { id: "badge-2", label: "AWS", hue: "education-matrix__badge--gold" },
  { id: "badge-3", label: "NLP", hue: "education-matrix__badge--ice" },
  { id: "badge-4", label: "ML", hue: "education-matrix__badge--silver" },
  { id: "badge-5", label: "OPS", hue: "education-matrix__badge--coral" },
];
