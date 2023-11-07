export interface ProjectManagerProjectDetailEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: number;
  clientId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  ProjectClient: ProjectClient;
  ProjectMember: ProjectMember[];
}

interface ProjectClient {
  id: string;
  name: string;
  code: string;
}

interface ProjectMember {
  id: string;
  userId: number;
  User: User;
}

interface User {
  id: number;
  name: string;
}
