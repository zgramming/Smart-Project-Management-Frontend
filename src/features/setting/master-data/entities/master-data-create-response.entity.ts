export interface MasterDataCreateResponseEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: number;
  parentMasterDataId: any;
  masterCategoryId: number;
  masterCategoryCode: string;
  name: string;
  code: string;
  description?: string;
  status: string;
  parameter1_key?: string;
  parameter1_value?: string;
  parameter2_key?: string;
  parameter2_value?: string;
  parameter3_key?: string;
  parameter3_value?: string;
  parameter4_key?: string;
  parameter4_value?: string;
  createdAt: string;
  updatedAt: string;
}
