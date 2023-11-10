import { DegreeOfDifficultyEnum, ProjectTaskStatusEnum } from '@/utils/enum';

export interface ProjectTaskCreateDTO {
  userId: number;
  projectId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  degreeOfDifficulty?: DegreeOfDifficultyEnum;
  status?: ProjectTaskStatusEnum;
}
