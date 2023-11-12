export interface ModulDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

 interface Data {
  id: number;
  categoryModulId: number;
  name: string;
  code: string;
  prefix: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
