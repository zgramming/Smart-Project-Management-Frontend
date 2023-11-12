import { ActiveStatusEnum } from '@/utils/enum';

export interface UserCreateDTO {
  roleId: number;
  name: string;
  username: string;
  password: string;
  email?: string;
  status?: ActiveStatusEnum;
}
