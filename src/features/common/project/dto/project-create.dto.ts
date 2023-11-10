import { ActiveStatusEnum, ProjectStatusEnum } from '@/utils/enum';

interface ProjectMember {
  userId: number;
  createdBy: number;
  status?: ActiveStatusEnum;
}

export interface ProjectCreateDTO {
  clientId: number;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatusEnum;
  createdBy: number;
  members: ProjectMember[];
}
