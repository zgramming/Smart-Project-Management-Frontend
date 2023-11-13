import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { ParameterEntity } from './entities/parameter.entity';
import { http } from '@/utils/http';
import { ParameterCreateDTO } from './dto/parameter-create.dto';
import { ParameterCreateResponseEntity } from './entities/parameter-create-response.entity';
import { ParameterUpdateDTO } from './dto/parameter-update.dto';
import { ParameterUpdateResponseEntity } from './entities/parameter-update-response.entity';
import { ParameterDeleteResponseEntity } from './entities/parameter-deletee-response.entity';
import { ParameterDetailEntity } from './entities/parameter-detail.entity';

interface UseListProps extends IBaseQueryParams {
  name?: string;
}

const url = {
  base: '/setting/parameter',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, name }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;
    if (name) {
      uri += `&name=${name}`;
    }

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ParameterEntity>(uri, http.fetcher);

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
    const { data: response, error, isLoading, isValidating, mutate } = useSWR<ParameterDetailEntity>(uri, http.fetcher);
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
  update: (id: string, data: ParameterUpdateDTO): Promise<ParameterUpdateResponseEntity> =>
    http.patch(`${url.base}/${id}`, data, null),
  create: (data: ParameterCreateDTO): Promise<ParameterCreateResponseEntity> => http.post(url.base, data, null),
  delete: (id: string): Promise<ParameterDeleteResponseEntity> => http.del(`${url.base}/${id}`, null),
};

export const ParameterRepository = {
  url,
  hooks,
  api,
};
