import { AccessMenuAllowedEnum } from '@/utils/enum';

export interface AccessMenuUpdateAccessDTO {
  roleId: number;
  menuId: number;
  modulId: number;
  allowedAccess: AccessMenuAllowedEnum[];
}
