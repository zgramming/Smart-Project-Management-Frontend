export interface DeveloperResumeDashboardEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  totalProject: number;
  totalProjectActive: number;
  totalProjectInactive: number;
  totalProjectSuspend: number;
  totalProjectFinish: number;
  totalMeeting: number;
  totalTask: number;
  totalTaskStatusFinish: number;
  totalTaskStatusPending: number;
  totalTaskStatusInProgress: number;
  totalTaskStatusRevision: number;
  totalTaskStatusCancel: number;
  totalTaskDifficultyEasy: number;
  totalTaskDifficultyMedium: number;
  totalTaskDifficultyHard: number;
  totalTaskDifficultyVeryHard: number;
  totalClient: number;
  meetingWillBeHeld: MeetingWillBeHeld[];
  newTaskAssignedToYou: NewTaskAssignedToYou[];
}

interface MeetingWillBeHeld {
  id: string;
  name: string;
  projectId: number;
  method: string;
  link: string;
  startDate: string;
  endDate: string;
  status: string;
  Project: Project;
}

interface Project {
  id: number;
  name: string;
  code: string;
  ProjectClient: ProjectClient;
}

interface ProjectClient {
  id: string;
  name: string;
  code: string;
}

interface NewTaskAssignedToYou {
  id: string;
  name: string;
  description: string;
  degreeOfDifficulty: string;
  startDate: string;
  endDate: string;
  status: string;
  Project: {
    id: number;
    name: string;
  };
}
