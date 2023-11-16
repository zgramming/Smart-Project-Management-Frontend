export interface ProjectTaskDetailEntity {
  error: boolean;
  message: string;
  data?: Data;
}

interface Data {
  id: string;
  projectId: number;
  userId: number;
  name: string;
  description: any;
  startDate: string;
  endDate: string;
  degreeOfDifficulty: string;
  status: string;
  approveStatus: string;
  createdAt: string;
  updatedAt: string;
  Project: Project;
  User: User;
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
