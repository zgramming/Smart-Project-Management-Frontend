import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ProjectManagerDocumentEntity } from './entities/project-manager-document.entity';
import { http } from '@/utils/http';
import { ProjectManagerDeleteDocumentResponseEntity } from './entities/project-manager-delete-document-response.entity';
import { ProjectManagerDocumentDetailEntity } from './entities/project-manager-document-detail.entity';
import { ProjectManagerCreateDocumentResponseEntity } from './entities/project-manager-create-document-response.entity';

interface UseListDocumentProps extends Partial<IBaseQueryParams> {
  projectId?: number;
  clientId?: string;
  name?: string;
}

const url = {
  base: '/project-document',
};

const hooks = {
  useListDocument: ({ page = 1, pageSize = 100, clientId, name, projectId }: UseListDocumentProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;
    if (clientId) uri += `&clientId=${clientId}`;
    if (name) uri += `&name=${name}`;
    if (projectId) uri += `&projectId=${projectId}`;

    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerDocumentEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total,
      error,
      isLoading,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerDocumentDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  async create(payload: FormData) {
    const response: ProjectManagerCreateDocumentResponseEntity = await http.post(`${url.base}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  async update(id: string, payload: FormData) {
    const response: ProjectManagerCreateDocumentResponseEntity = await http.patch(`${url.base}/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  async delete(id: string) {
    const response: ProjectManagerDeleteDocumentResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectManagerDocumentRepository = {
  url,
  hooks,
  api,
};
