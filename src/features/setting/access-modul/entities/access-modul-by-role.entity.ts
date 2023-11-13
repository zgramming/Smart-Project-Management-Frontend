export interface AccessModulByRoleEntity {
  error: boolean;
  message: string;
  data: Daum[];
}

interface Daum {
  id: string;
  categoryModulId: number;
  roleId: number;
  modulId: number;
  createdAt: string;
  updatedAt: string;
  Modul: Modul;
  Role: Role;
}

interface Modul {
  id: number;
  categoryModulId: number;
  name: string;
  code: string;
  prefix: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  Menu: Menu[];
}

interface Menu {
  id: number;
  parentMenuId?: number;
  modulId: number;
  name: string;
  code: string;
  prefix: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: number;
  name: string;
  code: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
