export type Role = "member" | "manager";
export type Page = "dashboard" | "reports" | "create-report" | "projects" | "ai-chat" | "team";

export interface User {
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  weekRange: string;
  project: string;
  tasksCompleted: string[];
  tasksPlanned: string[];
  blockers: string;
  hoursWorked: number;
  notes: string;
  status: "submitted" | "pending" | "late";
  submittedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  glow: string;
  members: number;
  reports: number;
  category: string;
  progress: number;
  lead: string;
  due: string;
}
