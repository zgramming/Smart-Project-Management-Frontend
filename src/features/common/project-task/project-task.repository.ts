import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectTaskStatusEnum } from '@/utils/enum';
import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectTaskEntitiy } from './entities/project-task.entity';
import { ProjectTaskDetailEntity } from './entities/project-task-detail.entity';
import { ProjectTaskCreateDTO } from './dto/project-task-create.dto';
import { ProjectTaskUpdateDTO } from './dto/project-task-update.dto';
import { ProjectTaskCreateResponseEntity } from './entities/project-task-create-response.entity';
import { ProjectTaskUpdateResponseEntity } from './entities/project-task-update-response.entity';
import { ProjectTaskDeleteResponseEntity } from './entities/project-task-delete-response.entity';
import { ISWRCustomConfig } from '@/interface/swr_config.interface';

interface UseListTaskProps extends Partial<IBaseQueryParams> {
  name?: string;
  projectId?: number;
  clientId?: string;
  status?: ProjectTaskStatusEnum;
}

const url = {
  base: '/project-task',
};
const hooks = {
  useListTask: ({ clientId, name, page = 1, pageSize = 100, projectId, status }: UseListTaskProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;
    if (clientId) uri += `&clientId=${clientId}`;
    if (name) uri += `&name=${name}`;
    if (projectId) uri += `&projectId=${projectId}`;
    if (status) uri += `&status=${status}`;

    const { data: response, error, isLoading, mutate } = useSWR<ProjectTaskEntitiy>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      mutate,
    };
  },

  useById: (id?: string, config?: ISWRCustomConfig<ProjectTaskDetailEntity>) => {
    const uri = id ? `${url.base}/${id}` : null;
    const {
      data: response,
      error,
      isLoading,
      mutate,
    } = useSWR<ProjectTaskDetailEntity>(uri, http.fetcher, {
      onSuccess(data, key, cfg) {
        if (config?.onSuccess) {
          config.onSuccess(data, key, cfg);
        }
      },
    });
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};
const api = {
  create: async (payload: ProjectTaskCreateDTO) => {
    const response: ProjectTaskCreateResponseEntity = await http.post(`${url.base}`, payload, null);
    return response;
  },
  update: async (id: string, payload: ProjectTaskUpdateDTO) => {
    const response: ProjectTaskUpdateResponseEntity = await http.patch(`${url.base}/${id}`, payload, null);
    return response;
  },
  delete: async (id: string) => {
    const response: ProjectTaskDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};
export const ProjectTaskRepository = {
  url,
  hooks,
  api,
};
