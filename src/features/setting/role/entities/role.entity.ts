export interface RoleEntity {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
