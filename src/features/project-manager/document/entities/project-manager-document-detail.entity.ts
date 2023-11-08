export interface ProjectManagerDocumentDetailEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: string;
  projectId: number;
  file: string;
  name: string;
  description: any;
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
