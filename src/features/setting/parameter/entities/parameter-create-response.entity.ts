export interface ParameterCreateResponseEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  name: string;
  code: string;
  value: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
