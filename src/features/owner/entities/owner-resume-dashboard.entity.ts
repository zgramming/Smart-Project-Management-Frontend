export interface OwnerResumeDashboardEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  totalUserDeveloper: number;
  totalUserProjectManager: number;
  totalProject: number;
  totalClient: number;
  totalDocument: number;
  totalMeeting: number;
  totalTask: number;
  statisticDeveloper: StatisticDeveloper[];
  statisticProjectManager: StatisticProjectManager[];
  recentProject: RecentProject[];
}

interface StatisticDeveloper {
  id: number;
  name: string;
  totalTask: number;
  totalProject: number;
}

interface StatisticProjectManager {
  id: number;
  name: string;
  totalProject: number;
  totalMeeting: number;
}

interface RecentProject {
  id: number;
  clientId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  ProjectClient: ProjectClient;
  ProjectMember: ProjectMember[];
}

interface ProjectClient {
  id: string;
  name: string;
  code: string;
}

interface ProjectMember {
  id: string;
  userId: number;
  User: User;
}

interface User {
  id: number;
  name: string;
}
