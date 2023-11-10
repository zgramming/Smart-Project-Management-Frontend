import useSWR from 'swr';
import { OwnerResumeDashboardEntity } from './entities/owner-resume-dashboard.entity';
import { http } from '@/utils/http';

const url = {
  base: '/owner',
  project: '/project',
};

const hooks = {
  useResumeDashboard: (year?: number) => {
    let uri = `${url.project}/resume-dashboard/owner`;
    if (year) {
      uri += `?year=${year}`;
    }

    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<OwnerResumeDashboardEntity>(uri, http.fetcher);

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

export const OwnerRepository = {
  url,
  hooks,
  api,
};
