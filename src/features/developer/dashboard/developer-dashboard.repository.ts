import useSWR from 'swr';
import { DeveloperResumeDashboardEntity } from './entities/developer-resume-dashboard.entity';
import { http } from '@/utils/http';

const url = {
  base: '/developer',
  project: '/project',
};

const hooks = {
  useResumeDashboard: (year?: number) => {
    let uri = `${url.project}/resume-dashboard/developer`;
    if (year) {
      uri += `?year=${year}`;
    }

    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<DeveloperResumeDashboardEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {};

export const DeveloperDashboardRepository = {
  url,
  hooks,
  api,
};
