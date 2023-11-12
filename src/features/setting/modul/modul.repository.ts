import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ModulEntity } from './entities/modul.entity';
import { http } from '@/utils/http';
import { ModulDetailEntity } from './entities/modul-detail.entity';
import { ModulCreateDTO } from './dto/modul-create.dto';
import { ModulCreateResponseEntity } from './entities/modul-create-response.entity';
import { ModulUpdateDTO } from './dto/modul-update.dto';
import { ModulUpdateResponseEntity } from './entities/modul-update-response.entity';
import { ModulDeleteResponseEntity } from './entities/modul-delete-response.entity';

interface UseListProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/setting/modul',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, name }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ModulEntity>(uri, http.fetcher);

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
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ModulDetailEntity>(uri, http.fetcher);

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
  create: async (data: ModulCreateDTO) => {
    const result: ModulCreateResponseEntity = await http.post(url.base, data, null);
    return result;
  },

  update: async (id: string, data: ModulUpdateDTO) => {
    const result: ModulUpdateResponseEntity = await http.patch(`${url.base}/${id}`, data, null);
    return result;
  },

  delete: async (id: string) => {
    const result: ModulDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return result;
  },
};

export const ModulRepository = {
  url,
  api,
  hooks,
};
