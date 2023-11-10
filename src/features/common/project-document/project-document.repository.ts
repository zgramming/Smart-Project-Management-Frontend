import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ProjectDocumentEntity } from './entities/project-document.entity';
import { http } from '@/utils/http';
import { ProjectDocumentDetailEntity } from './entities/project-document-detail.entity';
import { ProjectDocumentCreateResponseEntity } from './entities/project-document-create-response.entity';
import { ProjectDocumentUpdateResponseEntity } from './entities/project-document-update-response.entity';
import { ProjectDocumentDeleteResponseEntity } from './entities/project-document-delete-response.entity';

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

    const { data: response, error, isLoading, mutate } = useSWR<ProjectDocumentEntity>(uri, http.fetcher);
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
    const { data: response, error, isLoading, mutate } = useSWR<ProjectDocumentDetailEntity>(uri, http.fetcher);
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
    const response: ProjectDocumentCreateResponseEntity = await http.post(`${url.base}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  async update(id: string, payload: FormData) {
    const response: ProjectDocumentUpdateResponseEntity = await http.patch(`${url.base}/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  async delete(id: string) {
    const response: ProjectDocumentDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectDocumentRepository = {
  url,
  hooks,
  api,
};
