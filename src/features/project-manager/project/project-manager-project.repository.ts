import { http } from '@/utils/http';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ProjectManagerProjectEntity } from './entities/project-manager-project.entity';
import { ProjectManagerCreateProjectResponseEntity } from './entities/project-manager-create-project-response.entity';
import { ProjectManagerProjectDetailEntity } from './entities/project-manager-project-detail.entity';
import { ProjectManagerCreateProjectDTO } from './dto/create-project.dto';
import { ProjectManagerUpdateProjectDTO } from './dto/update-project-dto';
import { ProjectManagerUpdateProjectResponseEntity } from './entities/project-manager-update-project-response.entity';
import { ProjectManagerDeleteProjectResponseEntity } from './entities/project-manager-delete-project-response.entity';

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

    const { data, isLoading, error, mutate } = useSWR<ProjectManagerProjectEntity>(uri, http.fetcher);
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
    const { data, isLoading, error, mutate } = useSWR<ProjectManagerProjectDetailEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      isLoading,
      error,
      mutate,
    };
  },
};

const api = {
  create: async (data: ProjectManagerCreateProjectDTO) => {
    const response: ProjectManagerCreateProjectResponseEntity = await http.post(`${url.base}`, data, null);
    return response;
  },
  update: async (id: string, data: ProjectManagerUpdateProjectDTO) => {
    const response: ProjectManagerUpdateProjectResponseEntity = await http.patch(`${url.base}/${id}`, data, null);
    return response;
  },
  delete: async (id: string) => {
    const response: ProjectManagerDeleteProjectResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectManagerProjectRepository = {
  url,
  hooks,
  api,
};
