export interface UserOnlyDeveloperAndProjectManagerEntity {
  error: boolean;
  message: string;
  data: Datum[];
}

interface Datum {
  id: number;
  name: string;
  roleId: number;
  role: Role;
}

interface Role {
  id: number;
  name: string;
  code: string;
}
