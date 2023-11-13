import { ActiveStatusEnum } from '@/utils/enum';

export interface MasterCategoryCreateDTO {
  parentMasterCategoryId?: number;
  name: string;
  code: string;
  description?: string;
  status?: ActiveStatusEnum;
}
