import { ActiveStatusEnum } from '@/utils/enum';

export interface ParameterCreateDTO {
  name: string;
  code: string;
  value: string;
  description?: string;
  status?: ActiveStatusEnum;
}
