import { ActiveStatusEnum } from '@/utils/enum';

export interface MenuCreateDTO {
  parentMenuId?: number;
  modulId: number;
  name: string;
  code: string;
  prefix: string;
  description?: string;
  status?: ActiveStatusEnum;
}
