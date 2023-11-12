export interface CategoryModulDetailEntity {
  error: boolean;
  message: string;
  data: Daum;
}

interface Daum {
  id: number;
  name: string;
  code: string;
  prefix: string;
  description: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}
