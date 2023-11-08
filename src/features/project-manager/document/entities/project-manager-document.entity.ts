export interface ProjectManagerDocumentEntity {
  message: string;
  error: boolean;
  total: number;
  data: Daum[];
}

interface Daum {
  id: string;
  projectId: number;
  file: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Project: Project;
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
