import { ActiveStatusEnum } from '@/utils/enum';

export interface ProjectDocumentCreateDTO {
  projectId: number;
  name: string;
  file?: File;
  description?: string;
  status?: ActiveStatusEnum;
}

