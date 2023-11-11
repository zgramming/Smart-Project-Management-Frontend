import useSWR from 'swr';
import { DeveloperResumeDashboardEntity } from './entities/developer-resume-dashboard.entity';
import { http } from '@/utils/http';
import { DeveloperReportEntity } from './entities/developer-report.entity';

const url = {
  base: '/developer',
  project: '/project',
  report: '/project-report',
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

const api = {
  downloadReport: async (year?: number) => {
    let uri = `${url.report}/developer`;
    if (year) {
      uri += `?year=${year}`;
    }

    const result: DeveloperReportEntity = await http.post(uri, {}, null);

    return result;
  },
};

export const DeveloperDashboardRepository = {
  url,
  hooks,
  api,
};
