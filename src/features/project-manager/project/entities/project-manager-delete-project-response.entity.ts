export interface ProjectManagerDeleteProjectResponseEntity {
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
}
