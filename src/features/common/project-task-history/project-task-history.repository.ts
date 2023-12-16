import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectTaskHistoryEntity } from './entities/project-task-history.entity';
import useSWR from 'swr';
import { http } from '@/utils/http';

interface UseListTaskHistoryProps extends Partial<IBaseQueryParams> {
  projectId?: string;
}

const url = {
  base: (projectId: string) => `/project-task/${projectId}/history`,
};

const hooks = {
  useListTaskHistory: (projectId?: string, props?: UseListTaskHistoryProps) => {
    const { page = 1, pageSize = 100 } = props || {};
    const uri = projectId ? `${url.base(projectId)}?page=${page}&pageSize=${pageSize}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectTaskHistoryEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {};

export const ProjectTaskHistoryRepository = {
  url,
  hooks,
  api,
};
