import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { RoleEntity } from './entities/role.entity';
import { http } from '@/utils/http';
import { RoleDetailEntity } from './entities/role-detail.entity';
import { RoleCreateDTO } from './dto/role-create.dto';
import { RoleCreateResponseEntity } from './entities/role-create-response.entity';
import { RoleUpdateDTO } from './dto/role-update.dto';
import { RoleUpdateResponseEntity } from './entities/role-update-response.entity';
import { RoleDeleteResponseEntity } from './entities/role-delete-response.entity';

interface UseListRoleProps extends IBaseQueryParams {}

const url = {
  base: '/setting/role',
};

const hooks = {
  useListRole: ({ page = 1, pageSize = 100, query }: UseListRoleProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (query) {
      uri += `&name=${query}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<RoleEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      total: response?.total,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
  useById(id?: string) {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<RoleDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  create: async (body: RoleCreateDTO) => {
    const response: RoleCreateResponseEntity = await http.post(url.base, body, null);
    return response;
  },
  update: async (id: string, body: RoleUpdateDTO) => {
    const response: RoleUpdateResponseEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
  delete: async (id: string) => {
    const response: RoleDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const RoleRepository = {
  url,
  hooks,
  api,
};
