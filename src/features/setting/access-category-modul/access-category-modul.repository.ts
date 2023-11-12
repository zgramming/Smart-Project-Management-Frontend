import { http } from '@/utils/http';
import useSWR from 'swr';
import { AccessCategoryModulByRoleEntity } from './entities/access-category-modul-by-role.entity';
import { AccessCategoryModulSelectedUnselectedAccessEntity } from './entities/access-category-modul-selected-unselected-access.entity';
import { AccessCategoryModulUpdateAccessDTO } from './dto/access-category-modul-update-access.dto';
import { AccessCategoryModulUpdateAccessResponseEntity } from './entities/access-category-model-update-access-response.entity';

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
  useSelectedAndUnselectedAccess: (roleId?: string) => {
    const uri = `${url.base}/role/${roleId}/selected-unselected-access`;
    const {
      data: response,
      isLoading,
      error,
      mutate,
    } = useSWR<AccessCategoryModulSelectedUnselectedAccessEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      isLoading,
      error,
      mutate,
    };
  },
};

const api = {
  updateAccess: async (data: AccessCategoryModulUpdateAccessDTO) => {
    const result: AccessCategoryModulUpdateAccessResponseEntity = await http.post(`${url.base}`, data, null);
    return result;
  },
};

export const AccessCategoryModulRepository = {
  url,
  hooks,
  api,
};
