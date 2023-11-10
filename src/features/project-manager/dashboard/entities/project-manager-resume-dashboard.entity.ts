export interface ProjectManagerResumeDashboardEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  totalProject: number;
  totalDocument: number;
  totalMeeting: number;
  totalTask: number;
  projectsWillBeEndSoon: ProjectsWillBeEndSoon[];
}

interface ProjectsWillBeEndSoon {
  id: number;
  clientId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  createdBy: number;
  updatedBy: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}
