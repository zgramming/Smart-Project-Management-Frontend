import { ProjectTaskStatusEnum } from '@/utils/enum';

export interface DeveloperTaskUpdateStatusDTO {
  description: string;
  status: ProjectTaskStatusEnum;
}
