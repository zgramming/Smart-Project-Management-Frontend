import { ActiveStatusEnum } from '@/utils/enum';

export interface ProjectManagerCreateDocumentDto {
  projectId: number;
  name: string;
  file?: File;
  description?: string;
  status?: ActiveStatusEnum;
}

