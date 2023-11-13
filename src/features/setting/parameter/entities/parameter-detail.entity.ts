export interface ParameterDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  name: string;
  code: string;
  value: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
