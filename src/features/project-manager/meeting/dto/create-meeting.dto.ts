import { ActiveStatusEnum, ProjectMeetingMethodEnum } from '@/utils/enum';

interface ProjectMember {
  userId: number;
}

export interface ProjectManagerCreateMeetingDto {
  projectId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  method: ProjectMeetingMethodEnum;
  link: string;
  status: ActiveStatusEnum;
  members: ProjectMember[];
}
