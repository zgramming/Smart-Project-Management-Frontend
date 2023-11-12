export interface MenuEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
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
  Modul: Modul;
  ParentMenu?: ParentMenu;
  ChildrenMenu: ChildrenMenu[];
}

interface Modul {
  id: number;
  name: string;
  categoryModulId: number;
  CategoryModul: CategoryModul;
}

interface CategoryModul {
  id: number;
  name: string;
}

interface ParentMenu {
  id: number;
  name: string;
}

interface ChildrenMenu {
  id: number;
  name: string;
}
