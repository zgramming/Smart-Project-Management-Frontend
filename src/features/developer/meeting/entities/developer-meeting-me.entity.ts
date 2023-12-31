export interface DeveloperMeetingMeEntity {
  message: string;
  error: boolean;
  total: number;
  data: Daum[];
}

interface Daum {
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
  clientId: string;
  ProjectClient: ProjectClient;
}

interface ProjectClient {
  id: string;
  name: string;
  code: string;
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
