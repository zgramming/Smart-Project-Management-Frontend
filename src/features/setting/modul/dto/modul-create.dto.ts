import { ActiveStatusEnum } from '@/utils/enum';

export interface ModulCreateDTO {
  categoryModulId: number;
  name: string;
  code: string;
  prefix: string;

  description?: string;

  status?: ActiveStatusEnum;
}
