import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectEntity } from './entities/project.entity';
import { ProjectDetailEntity } from './entities/project-detail.entity';
import { ProjectCreateDTO } from './dto/project-create.dto';
import { ProjectUpdateDTO } from './dto/project-update.dto';
import { ProjectCreateResponseEntity } from './entities/project-create-response.entity';
import { ProjectUpdateResponseEntity } from './entities/project-update-response.entity';
import { ProjectDeleteResponseEntity } from './entities/project-delete-response.entity';
import useSWR from 'swr';
import { http } from '@/utils/http';

interface UseListProjectProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/project',
};

const hooks = {
  useListProject: (params: UseListProjectProps) => {
    const { name, page = 1, pageSize = 100 } = params;
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const { data, isLoading, error, mutate } = useSWR<ProjectEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      total: data?.total || 0,
      isLoading,
      error,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id ? `${url.base}/${parseInt(id)}` : null;
    const { data, isLoading, error, mutate } = useSWR<ProjectDetailEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      isLoading,
      error,
      mutate,
    };
  },
};

const api = {
  create: async (data: ProjectCreateDTO) => {
    const response: ProjectCreateResponseEntity = await http.post(`${url.base}`, data, null);
    return response;
  },
  update: async (id: string, data: ProjectUpdateDTO) => {
    const response: ProjectUpdateResponseEntity = await http.patch(`${url.base}/${id}`, data, null);
    return response;
  },
  delete: async (id: string) => {
    const response: ProjectDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectRepository = {
  url,
  hooks,
  api,
};
