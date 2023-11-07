import { http } from '@/utils/http';
import useSWR from 'swr';
import { AccessCategoryModulByRoleEntity } from './entities/access-category-modul-by-role.entity';

const url = {
  base: '/setting/access-category-modul',
};

const hooks = {
  useListAccessByRole: () => {
    const {
      data: response,
      isLoading,
      error,
      mutate,
    } = useSWR<AccessCategoryModulByRoleEntity>(`${url.base}/role`, http.fetcher);

    return {
      data: response,
      isLoading,
      error,
      mutate,
    };
  },
};

const api = {};

export const AccessCategoryModulRepository = {
  url,
  hooks,
  api,
};
