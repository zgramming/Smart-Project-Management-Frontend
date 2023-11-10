export interface ProjectMeetingDetailEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: string;
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  method: string;
  link: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Project: Project;
  ProjectMeetingMember: ProjectMeetingMember[];
}

interface Project {
  id: number;
  name: string;
}

interface ProjectMeetingMember {
  id: string;
  userId: number;
  User: User;
}

interface User {
  id: number;
  name: string;
  roleId: number;
  role: Role;
}

interface Role {
  id: number;
  name: string;
}
