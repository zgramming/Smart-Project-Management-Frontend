import useSWR from 'swr';
import { AccessModulSelectedUnselectedAccessEntity } from './entities/access-modul-selected-unselected-access.entity';
import { http } from '@/utils/http';
import { AccessModulUpdateAccessDTO } from './dto/access-modul-update-access.dto';
import { AccessModulUpdateAccessResponseEntity } from './entities/access-modul-update-access-response.entity';
import { AccessModulByRoleEntity } from './entities/access-modul-by-role.entity';

const url = {
  base: '/setting/access-modul',
};

const hooks = {
  useSelectedUnselectedAccess: (roleId?: string) => {
    const uri = `${url.base}/role/${roleId}/selected-unselected-access`;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AccessModulSelectedUnselectedAccessEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useByRole: (roleId?: string) => {
    const uri = roleId ? `${url.base}/role/${roleId}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AccessModulByRoleEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {
  updateAccess: async (body: AccessModulUpdateAccessDTO) => {
    const result: AccessModulUpdateAccessResponseEntity = await http.post(`${url.base}`, body, null);
    return result;
  },
};

export const AccessModulRepository = {
  url,
  hooks,
  api,
};
