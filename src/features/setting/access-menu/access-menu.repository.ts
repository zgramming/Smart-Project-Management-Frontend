import { http } from '@/utils/http';
import { AccessMenuUpdateAccessDTO } from './dto/access-menu-update-access.dto';
import useSWR from 'swr';
import { AccessMenuByRoleEntity } from './entities/access-menu-by-role.entity';

const url = {
  base: '/setting/access-menu',
};

const hooks = {
  useByRole: (roleId?: string) => {
    const uri = roleId ? `${url.base}/role/${roleId}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<AccessMenuByRoleEntity>(uri, http.fetcher);

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
  updateAccess: async (body: AccessMenuUpdateAccessDTO[]) => {
    const result = await http.post(
      `${url.base}`,
      {
        values: body,
      },
      null,
    );
    return result;
  },
};

export const AccessMenuRepository = {
  url,
  hooks,
  api,
};
