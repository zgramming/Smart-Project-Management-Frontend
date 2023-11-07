export interface ProjectManagerDeleteClientEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: string;
  name: string;
  code: string;
  description: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}
