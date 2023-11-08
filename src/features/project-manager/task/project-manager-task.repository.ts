import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectTaskStatusEnum } from '@/utils/enum';
import { ProjectManagerTaskEntity } from './entities/project-manager-task.entity';
import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectManagerTaskDetailEntity } from './entities/project-manager-task-detail.entity';
import { ProjectManagerDeleteTaskResponseEntity } from './entities/project-manager-delete-task-response.entity';
import { ProjectManagerCreateTaskResponseEntity } from './entities/project-manager-create-task-response.entity';
import { ProjectManagerCreateTaskDto } from './dto/create-task.entity';
import { ProjectManagerUpdateTaskDto } from './dto/update-task.entity';
import { ProjectManagerUpdateTaskResponseEntity } from './entities/project-manager-update-task-response.entity';

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

    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerTaskEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      mutate,
    };
  },

  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerTaskDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  create: async (payload: ProjectManagerCreateTaskDto) => {
    const response: ProjectManagerCreateTaskResponseEntity = await http.post(`${url.base}`, payload, null);
    return response;
  },
  update: async (id: string, payload: ProjectManagerUpdateTaskDto) => {
    const response: ProjectManagerUpdateTaskResponseEntity = await http.patch(`${url.base}/${id}`, payload, null);
    return response;
  },
  delete: async (id: string) => {
    const response: ProjectManagerDeleteTaskResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectManagerTaskRepository = {
  url,
  hooks,
  api,
};
