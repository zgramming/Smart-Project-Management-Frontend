export interface RoleEntity {
  message: string;
  error: boolean;
  total: number;
  data: Daum[];
}

interface Daum {
  id: number;
  name: string;
  code: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
