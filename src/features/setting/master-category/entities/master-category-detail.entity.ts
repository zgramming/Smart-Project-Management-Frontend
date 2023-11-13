export interface MasterCategoryDetailEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  parentMasterCategoryId: any;
  name: string;
  code: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
