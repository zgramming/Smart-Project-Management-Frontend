export interface ProjectManagerUpdateTaskResponseEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  id: string;
  projectId: number;
  userId: number;
  name: string;
  description: any;
  startDate: string;
  endDate: string;
  degreeOfDifficulty: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
