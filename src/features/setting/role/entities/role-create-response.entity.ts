export interface RoleCreateResponseEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: number;
  name: string;
  code: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
