import { http } from '@/utils/http';
import useSWR from 'swr';
import { MasterDataByMasterCategoryCodeEntity } from './entities/master-data-by-master-category-code.entity';
import { MasterDataDeleteResponseEntity } from './entities/master-data-delete-response.entity';
import { MasterDataCreateDTO } from './dto/master-data-create.dto';
import { MasterDataCreateResponseEntity } from './entities/master-data-create-response.entity';
import { MasterDataUpdateDTO } from './dto/master-data-update.dto';
import { MasterDataUpdateResponseEntity } from './entities/master-data-update-response.entity';
import { MasterDataDetailEntity } from './entities/master-data-detail.entity';

const url = {
  base: '/setting/master-data',
};

const hooks = {
  useByMasterCategoryCode: (masterCategoryCode?: string) => {
    const uri = masterCategoryCode ? `${url.base}/master-category/code/${masterCategoryCode}` : null;
    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<MasterDataByMasterCategoryCodeEntity>(uri, http.fetcher);
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
    } = useSWR<MasterDataDetailEntity>(uri, http.fetcher);
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
  create: (data: MasterDataCreateDTO): Promise<MasterDataCreateResponseEntity> => http.post(url.base, data, null),
  update: (id: string, data: MasterDataUpdateDTO): Promise<MasterDataUpdateResponseEntity> =>
    http.patch(`${url.base}/${id}`, data, null),
  delete: (id: string): Promise<MasterDataDeleteResponseEntity> => http.del(`${url.base}/${id}`, null),
};

export const MasterDataRepository = {
  url,
  hooks,
  api,
};
