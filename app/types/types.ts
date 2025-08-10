export interface Employee {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  department: "Sales" | "Technical" | "Finance";
  status: "active" | "inactive";
  phone?: string;
  telegram?: string;
}

export type FilteredEmployee = Omit<Employee, "avatarUrl">;

export interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
}

export type TaskStatus = Task["status"];

export interface NotificationData {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

export type TabKey = "info" | "tasks";