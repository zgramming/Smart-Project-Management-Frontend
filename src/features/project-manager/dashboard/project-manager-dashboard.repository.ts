import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectManagerResumeDashboardEntity } from './entities/project-manager-resume-dashboard.entity';

const url = {
  base: '/project-manager',
  project: '/project',
};

const hooks = {
  useResumeDashboard: (year?: number) => {
    let uri = `${url.project}/resume-dashboard/project-manager`;

    if (year) {
      uri += `?year=${year}`;
    }

    const {
      data: response,
      error,
      mutate,
      isLoading,
      isValidating,
    } = useSWR<ProjectManagerResumeDashboardEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      mutate,
      isLoading,
      isValidating,
    };
  },
};

const api = {};

export const ProjectManagerDashboardRepository = {
  url,
  hooks,
  api,
};
