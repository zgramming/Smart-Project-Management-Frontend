export interface UserCreateResponseEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  roleId: number;
  name: string;
  username: string;
  email: any;
  password: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
