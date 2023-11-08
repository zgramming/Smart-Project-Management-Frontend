export interface ProjectManagerUpdateDocumentResponseEntity {
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
}
