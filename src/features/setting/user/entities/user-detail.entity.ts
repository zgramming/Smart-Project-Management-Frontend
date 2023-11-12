export interface UserDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  name: string;
  username: string;
  status: string;
  roleId: number;
  role: Role;
}

interface Role {
  id: number;
  name: string;
  code: string;
}
