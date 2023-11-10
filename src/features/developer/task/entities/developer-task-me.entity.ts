export interface DeveloperTaskMeEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
  id: string;
  projectId: number;
  userId: number;
  name: string;
  description: any;
  startDate: string;
  endDate: string;
  degreeOfDifficulty: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Project: Project;
  ProjectTaskHistory: ProjectTaskHistory[];
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

interface ProjectTaskHistory {
  id: string;
  userId: number;
  description: string;
  status: string;
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
