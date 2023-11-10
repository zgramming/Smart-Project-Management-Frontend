import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { DeveloperTaskMeEntity } from './entities/developer-task-me.entity';
import { http } from '@/utils/http';
import { DeveloperTaskUpdateStatusDTO } from './dto/developer-task-update-status.dto';
import { DeveloperTaskUpdateStatusResponseEntity } from './entities/developer-task-update-status-response.entity';

interface UseMeProps extends Partial<IBaseQueryParams> {
  name?: string;
  clientId?: string;
  projectId?: string;
  status?: string;
}

const url = {
  base: '/project-task',
};

const hooks = {
  useMe({ page = 1, pageSize = 100, name, clientId, projectId, status }: UseMeProps) {
    let uri = `${url.base}/me?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    if (clientId) {
      uri += `&clientId=${clientId}`;
    }

    if (projectId) {
      uri += `&projectId=${projectId}`;
    }

    if (status) {
      uri += `&status=${status}`;
    }

    const { data: response, error, isLoading, mutate, isValidating } = useSWR<DeveloperTaskMeEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      mutate,
      isValidating,
    };
  },
};

const api = {
  async updateStatus(id: string, data: DeveloperTaskUpdateStatusDTO) {
    const result: DeveloperTaskUpdateStatusResponseEntity = await http.patch(`${url.base}/${id}/status`, data, null);
    return result;
  },
};

export const DeveloperTaskRepository = {
  url,
  hooks,
  api,
};
