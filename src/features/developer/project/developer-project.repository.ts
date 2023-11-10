import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { DeveloperProjectMeEntity } from './entities/developer-project-me.entity';
import { http } from '@/utils/http';

interface UseMeProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/project',
};

const hooks = {
  useMe({ page = 1, pageSize = 100, name }: UseMeProps) {
    let uri = `${url.base}/me?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const {
      data: response,
      error,
      mutate,
      isValidating,
      isLoading,
    } = useSWR<DeveloperProjectMeEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      mutate,
      isValidating,
      isLoading,
    };
  },
};

const api = {};

export const DeveloperProjectRepository = {
  url,
  hooks,
  api,
};
