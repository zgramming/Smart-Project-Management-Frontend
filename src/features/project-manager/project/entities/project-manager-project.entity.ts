export interface ProjectManagerProjectEntity {
  message: string;
  error: boolean;
  total: number;
  data: Daum[];
}

interface Daum {
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
