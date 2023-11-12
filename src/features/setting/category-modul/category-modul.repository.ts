import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { CategoryModulEntity } from './entities/category-modul.entity';
import { http } from '@/utils/http';
import { CategoryModulDetailEntity } from './entities/category-modul-detail.entity';
import { CategoryModulCreateDTO } from './dto/category-modul-create.dto';
import { CategoryModulUpdateDTO } from './dto/category-modul-update.dto';
import { CategoryModulCreateResponseEntity } from './entities/category-modul-create-response.entity';
import { CategoryModulUpdateeResponseEntity } from './entities/category-modul-update-response.entity';
import { CategoryModulDeleteResponseEntity } from './entities/category-modul-delete-response.entity';

interface UseListProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/setting/category-modul',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, name }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<CategoryModulEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total || 0,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },

  useById: (id?: string) => {
    const uri = id ? `${url.base}/${id}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<CategoryModulDetailEntity>(uri, http.fetcher);
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
  create: async (data: CategoryModulCreateDTO) => {
    const result: CategoryModulCreateResponseEntity = await http.post(url.base, data, null);
    return result;
  },
  update: async (id: string, data: CategoryModulUpdateDTO) => {
    const result: CategoryModulUpdateeResponseEntity = await http.patch(`${url.base}/${id}`, data, null);
    return result;
  },
  delete: async (id: string) => {
    const result: CategoryModulDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return result;
  },
};

export const CategoryModulRepository = {
  url,
  api,
  hooks,
};
