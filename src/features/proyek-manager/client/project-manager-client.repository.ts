import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectManagerClientEntity } from './entities/project-manager-client.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';

interface UseListClientProps extends IBaseQueryParams {
  name?: string;
}

const url = {
  base: '/project-client',
};

const hooks = {
  useListClient({ page = 1, pageSize = 100, name }: UseListClientProps) {
    let uri = `${url.base}?page=${page}&pageSize=${pageSize}`;

    if (name && name.length > 0) {
      uri += `&name=${name}`;
    }

    console.log({ uri });

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

const api = {};

export const ProjectManagerClientRepository = {
  url,
  hooks,
  api,
};
