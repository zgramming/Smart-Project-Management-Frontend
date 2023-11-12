import useSWR from 'swr';
import { UserOnlyDeveloperAndProjectManagerEntity } from './entities/user-only-developer-and-pm.entity';
import { http } from '@/utils/http';
import { UserMeEntity } from './entities/user-me.entity';
import { UserEntity } from './entities/user.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { UserCreateDTO } from './dto/user-create.dto';
import { UserCreateResponseEntity } from './entities/user-create-response.entity';
import { UserUpdateDTO } from './dto/user-update.dto';
import { UserDeleteResponseEntity } from './entities/user-delete-response.entity';
import { UserDetailEntity } from './entities/user-detail.entity';

interface UseListUserProps extends Partial<IBaseQueryParams> {}

const url = {
  base: `/setting/user`,
};

const hooks = {
  useMe: () => {
    const uri = `${url.base}/me`;
    const { data, error, isLoading, mutate } = useSWR<UserMeEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      error,
      isLoading,
      mutate,
    };
  },
  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data, error, isLoading, mutate } = useSWR<UserDetailEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      error,
      isLoading,
      mutate,
    };
  },
  useListUser: (params?: UseListUserProps) => {
    const { page = 1, pageSize = 100 } = params || {};
    const uri = `${url.base}?page=${page}&limit=${pageSize}`;

    const { data, error, isLoading, mutate } = useSWR<UserEntity>(uri, http.fetcher);
    return {
      data: data?.data,
      total: data?.total || 0,
      error,
      isLoading,
      mutate,
    };
  },
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

const api = {
  create: async (body: UserCreateDTO) => {
    const response: UserCreateResponseEntity = await http.post(url.base, body, null);
    return response;
  },
  update: async (id: string, body: UserUpdateDTO) => {
    const response: UserCreateResponseEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
  delete: async (id: string) => {
    const response: UserDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const UserRepository = {
  url,
  hooks,
  api,
};
