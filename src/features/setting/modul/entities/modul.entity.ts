export interface ModulEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
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
