export interface Incident {
  id: string;
  reporterName: string;
  phone: string;
  description: string;
  crisisType: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  confidence: number;
  summary: string;
  location: string;
  latitude: number;
  longitude: number;
  recommendedDepartments: string[];
  assignedDepartment: string;
  status: "New" | "Acknowledged" | "Team Dispatched" | "In Progress" | "Resolved";
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export type UserRole = "Citizen" | "Admin" | "Department Officer";

export type DepartmentName =
  | "Fire and Rescue"
  | "Police"
  | "Ambulance and Medical"
  | "Disaster Management"
  | "Electricity Department";

export type PageId =
  | "landing"
  | "login"
  | "register"
  | "report"
  | "analysis-result"
  | "admin-dashboard"
  | "incidents-list"
  | "incident-details"
  | "department-dashboard"
  | "live-map"
  | "analytics"
  | "ai-pipeline";
