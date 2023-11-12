import { ActiveStatusEnum } from '@/utils/enum';

export interface CategoryModulCreateDTO {
  name: string;
  code: string;
  prefix: string;
  description?: string;
  status?: ActiveStatusEnum;
}
