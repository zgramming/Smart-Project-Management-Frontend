import useSWR from 'swr';
import { DeveloperMeetingMeEntity } from './entities/developer-meeting-me.entity';
import { http } from '@/utils/http';
import { IBaseQueryParams } from '@/interface/base_query_params.interface';

interface UseMeProps extends Partial<IBaseQueryParams> {
  name?: string;
  projectId?: string;
  method?: string;
}

const url = {
  base: '/project-meeting',
};

const hooks = {
  useMe({ page = 1, pageSize = 100, method, projectId, name }: UseMeProps) {
    let uri = `${url.base}/me?page=${page}&limit=${pageSize}`;

    if (method) {
      uri += `&method=${method}`;
    }

    if (projectId) {
      uri += `&projectId=${projectId}`;
    }

    if (name) {
      uri += `&name=${name}`;
    }

    const {
      data: response,
      error,
      isLoading,
      isValidating,
      mutate,
    } = useSWR<DeveloperMeetingMeEntity>(uri, http.fetcher);

    return {
      data: response?.data,
      total: response?.total,
      error,
      isLoading,
      isValidating,
      mutate,
    };
  },
};

const api = {};

export const DeveloperMeetingRepository = {
  url,
  hooks,
  api,
};
