export interface UserEntity {
  error: boolean;
  message: string;
  total: number;
  data: Datum[];
}

interface Datum {
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
