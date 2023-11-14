import { ActiveStatusEnum } from '@/utils/enum';

export interface MasterDataCreateDTO {
  parentMasterDataId?: number;
  masterCategoryCode: string;
  name: string;
  code: string;
  description?: string;
  status?: ActiveStatusEnum;
  parameter1_key?: string;
  parameter1_value?: string;
  parameter2_key?: string;
  parameter2_value?: string;
  parameter3_key?: string;
  parameter3_value?: string;
  parameter4_key?: string;
  parameter4_value?: string;
}
