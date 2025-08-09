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

export interface Task {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
}
