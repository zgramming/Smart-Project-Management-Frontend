import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectManagerClientEntity } from './entities/project-manager-client.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectManagerCreateClientDto } from './dto/create-client.dto';
import { ProjectManagerCreateClientEntity } from './entities/project-manager-create-client-response.entity';
import { ProjectManagerDeleteClientEntity } from './entities/project-manager-delete-client-response.entity';
import { ProjectManagerClientDetailEntity } from './entities/project-manager-client-detail.entity';
import { ProjectManagerUpdateClientDto } from './dto/update-client.dto';

interface UseListClientProps extends IBaseQueryParams {
  name?: string;
}

const url = {
  base: '/project-client',
};

const hooks = {
  useById(id?: string) {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerClientDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
  useListClient({ page = 1, pageSize = 100, name }: UseListClientProps) {
    let uri = `${url.base}?page=${page}&pageSize=${pageSize}`;

    if (name && name.length > 0) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerClientEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  async create(body: ProjectManagerCreateClientDto) {
    const response: ProjectManagerCreateClientEntity = await http.post(url.base, body, null);
    return response;
  },

  async delete(id: string) {
    const response: ProjectManagerDeleteClientEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },

  async update(id: string, body: ProjectManagerUpdateClientDto) {
    const response: ProjectManagerCreateClientEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
};

export const ProjectManagerClientRepository = {
  url,
  hooks,
  api,
};
