export interface AccessCategoryModulByRoleEntity {
  message: string;
  data: Daum[];
}

interface Daum {
  id: string;
  roleId: number;
  categoryModulId: number;
  createdAt: string;
  updatedAt: string;
  Role: Role;
  CategoryModul: CategoryModul;
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

interface CategoryModul {
  id: number;
  name: string;
  code: string;
  AccessModul: AccessModul[];
}

interface AccessModul {
  id: string;
  modulId: number;
  roleId: number;
  Modul: Modul;
}

interface Modul {
  id: number;
  name: string;
  code: string;
  AccessMenu: AccessMenu[];
}

interface AccessMenu {
  id: string;
  menuId: number;
  roleId: number;
  allowedAccess: string[];
  Menu: Menu;
}

interface Menu {
  id: number;
  name: string;
  code: string;
  prefix: string;
}
