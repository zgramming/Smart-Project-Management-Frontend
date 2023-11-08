export interface ProjectManagerUpdateMeetingResponseEntity {
  message: string;
  error: boolean;
  data: Data;
}

interface Data {
  id: string;
  projectId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  method: string;
  link: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
