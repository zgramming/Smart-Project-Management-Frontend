import { http } from '@/utils/http';
import { MenuCreateDTO } from './dto/menu-create.dto';
import { MenuUpdateDTO } from './dto/menu-update.dto';
import { MenuCreateResponseEntity } from './entities/menu-create-response.entity';
import { MenuUpdateResponseEntity } from './entities/menu-update-response.entity';
import { MenuDeleteResponseEntity } from './entities/menu-delete-response.entity';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { MenuEntity } from './entities/menu.entity';
import useSWR from 'swr';
import { MenuDetailEntity } from './entities/menu-detail..entity';
import { MenuByModulEntity } from './entities/menu-by-modul.entity';

interface UseListProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/setting/menu',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, name }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MenuEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useByModulId: (id?: string) => {
    const uri = id ? `${url.base}/modul/${id}` : null;
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MenuByModulEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MenuDetailEntity>(uri, http.fetcher);

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
  create: async (data: MenuCreateDTO) => {
    const result: MenuCreateResponseEntity = await http.post(url.base, data, null);
    return result;
  },

  update: async (id: string, data: MenuUpdateDTO) => {
    const result: MenuUpdateResponseEntity = await http.patch(`${url.base}/${id}`, data, null);
    return result;
  },

  delete: async (id: string) => {
    const result: MenuDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return result;
  },
};

export const MenuRepository = {
  url,
  hooks,
  api,
};
