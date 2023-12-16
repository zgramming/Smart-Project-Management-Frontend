export interface ProjectTaskHistoryEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
  id: string;
  projectTaskId: string;
  userId: number;
  linkTask: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
