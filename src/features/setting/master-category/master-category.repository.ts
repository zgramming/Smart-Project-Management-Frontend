import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import useSWR from 'swr';
import { MasterCategoryEntity } from './entities/master-category.entity';
import { http } from '@/utils/http';
import { MasterCategoryDetailEntity } from './entities/master-category-detail.entity';
import { MasterCategoryCreateDTO } from './dto/master-category-create.dto';
import { MasterCategoryCreateResponseEntity } from './entities/master-category-create-response.entity';
import { MasterCategoryUpdateDTO } from './dto/master-category-update.dto';
import { MasterCategoryUpdateResponseEntity } from './entities/master-category-update-response.entity';
import { MasterCategoryDeleteResponseEntity } from './entities/master-category-delete-response.entity';

interface UseListProps extends Partial<IBaseQueryParams> {
  name?: string;
}

const url = {
  base: '/setting/master-category',
};

const hooks = {
  useList: ({ page = 1, pageSize = 100, name }: UseListProps) => {
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;
    if (name) uri += `&name=${name}`;

    const { data: response, error, isLoading, isValidating, mutate } = useSWR<MasterCategoryEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      total: response?.total || 0,
      isLoading,
      error,
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
    } = useSWR<MasterCategoryDetailEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      isLoading,
      error,
      isValidating,
      mutate,
    };
  },
};

const api = {
  create: (data: MasterCategoryCreateDTO): Promise<MasterCategoryCreateResponseEntity> =>
    http.post(`${url.base}`, data, null),
  update: (id: string, data: MasterCategoryUpdateDTO): Promise<MasterCategoryUpdateResponseEntity> =>
    http.patch(`${url.base}/${id}`, data, null),
  delete: (id: string): Promise<MasterCategoryDeleteResponseEntity> => http.del(`${url.base}/${id}`, null),
};

export const MasterCategoryRepository = {
  url,
  hooks,
  api,
};
