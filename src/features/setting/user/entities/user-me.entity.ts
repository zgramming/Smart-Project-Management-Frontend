export interface UserMeEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  roleId: number;
  name: string;
  username: string;
  role: Role;
}

interface Role {
  id: number;
  name: string;
  code: string;
}
