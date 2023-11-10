export interface ProjectClientCreateResponseEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
