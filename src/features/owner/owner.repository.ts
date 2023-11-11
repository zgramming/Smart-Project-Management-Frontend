import useSWR from 'swr';
import { OwnerResumeDashboardEntity } from './entities/owner-resume-dashboard.entity';
import { http } from '@/utils/http';
import { OwnerReportEntity } from './entities/owner-report.entity';

const url = {
  base: '/owner',
  project: '/project',
  report: '/project-report',
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

const api = {
  downloadReport: async (year?: number) => {
    let uri = `${url.report}/owner`;
    if (year) {
      uri += `?year=${year}`;
    }

    const result: OwnerReportEntity = await http.post(uri, {}, null);

    return result;
  },
};

export const OwnerRepository = {
  url,
  hooks,
  api,
};
