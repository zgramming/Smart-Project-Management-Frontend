export interface MenuDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
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
