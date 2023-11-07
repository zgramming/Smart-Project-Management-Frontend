import useSWR from 'swr';
import { UserOnlyDeveloperAndProjectManagerEntity } from './entities/user-only-developer-and-pm.entity';
import { http } from '@/utils/http';

const url = {
  base: `/setting/user`,
};

const hooks = {
  useOnlyDeveloperAndProjectManagerRole: () => {
    const uri = `${url.base}/by-role/developer-and-project-manager`;

    const {
      data: response,
      error,
      isLoading,
      mutate,
    } = useSWR<UserOnlyDeveloperAndProjectManagerEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {};

export const UserRepository = {
  url,
  hooks,
  api,
};
