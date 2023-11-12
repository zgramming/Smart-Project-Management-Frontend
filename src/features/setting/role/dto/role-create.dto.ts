import { ActiveStatusEnum } from '@/utils/enum';

export interface RoleCreateDTO {
  name: string;
  code: string;
  description?: string;
  status?: ActiveStatusEnum;
}

