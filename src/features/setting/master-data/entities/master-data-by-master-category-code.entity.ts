export interface MasterDataByMasterCategoryCodeEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
  id: number;
  parentMasterDataId: any;
  masterCategoryId: number;
  masterCategoryCode: string;
  name: string;
  code: string;
  description: any;
  status: string;
  parameter1_key: any;
  parameter1_value: any;
  parameter2_key: any;
  parameter2_value: any;
  parameter3_key: any;
  parameter3_value: any;
  parameter4_key: any;
  parameter4_value: any;
  createdAt: string;
  updatedAt: string;
}
