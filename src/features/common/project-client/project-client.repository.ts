import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ProjectClientEntity } from './entities/project-client.entity';
import { http } from '@/utils/http';
import { ProjectClientDetailEntity } from './entities/project-client-detail.entity';
import { ProjectClientCreateDTO } from './dto/project-client-create.dto';
import { ProjectClientUpdateDTO } from './dto/project-client-update.dto';
import { ProjectClientCreateResponseEntity } from './entities/project-client-create-response.entity';
import { ProjectClientDeleteResponseEntity } from './entities/project-client-delete-response.entity';
import { ProjectClientUpdateResponseEntity } from './entities/project-client-update-response.entity';

interface UseListClientProps extends IBaseQueryParams {
  name?: string;
}

const url = {
  base: '/project-client',
};

const hooks = {
  useById(id?: string) {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectClientDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
  useListClient({ page = 1, pageSize = 100, name }: UseListClientProps) {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name && name.length > 0) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, mutate } = useSWR<ProjectClientEntity>(uri, http.fetcher);
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
  async create(body: ProjectClientCreateDTO) {
    const response: ProjectClientCreateResponseEntity = await http.post(url.base, body, null);
    return response;
  },

  async delete(id: string) {
    const response: ProjectClientDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },

  async update(id: string, body: ProjectClientUpdateDTO) {
    const response: ProjectClientUpdateResponseEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
};

export const ProjectClientRepository = {
  url,
  hooks,
  api,
};
