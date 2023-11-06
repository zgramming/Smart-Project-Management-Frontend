export interface ModulEntity {
  id: number;
  categoryModulId: number;
  name: string;
  code: string;
  prefix: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
