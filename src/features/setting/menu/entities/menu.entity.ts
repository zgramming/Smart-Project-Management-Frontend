export interface MenuEntity {
  id: number;
  parentMenuId?: number;
  modulId: number;
  name: string;
  code: string;
  prefix: string;
  description: null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
