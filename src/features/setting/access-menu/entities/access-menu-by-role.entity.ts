export interface AccessMenuByRoleEntity {
  error: boolean;
  message: string;
  data: Daum[];
}

interface Daum {
  id: string;
  menuId: number;
  modulId: number;
  roleId: number;
  allowedAccess: string[];
  Modul: Modul;
  Menu: Menu;
}

interface Modul {
  id: number;
  name: string;
  code: string;
}

interface Menu {
  id: number;
  name: string;
  code: string;
}
