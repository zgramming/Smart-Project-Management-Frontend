import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectManagerMeetingEntity } from './entities/project-manager-meeting.entity';
import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectManagerMeetingDetailEntity } from './entities/project-manager-meeting-detail.entity';
import { ProjectManagerDeleteMeetingResponseEntity } from './entities/project-manager-delete-meeting-response.entity';
import { ProjectManagerCreateMeetingDto } from './dto/create-meeting.dto';
import { ProjectManagerCreateMeetingResponseEntity } from './entities/project-manager-create-meeting-response.entity';
import { ProjectManagerUpdateMeetingDto } from './dto/update-meeting.dto';
import { ProjectManagerUpdateMeetingResponseEntity } from './entities/project-manager-update-meeting-response.entity';

interface UseListMeetingProps extends IBaseQueryParams {
  name?: string;
  projectId?: number;
  method?: string;
}

const url = {
  base: '/project-meeting',
};

const hooks = {
  useListMeeting({ page = 1, pageSize = 100, name, projectId, method }: UseListMeetingProps) {
    let uri = `${url.base}?page=${page}&pageSize=${pageSize}`;

    if (name && name.length > 0) {
      uri += `&name=${name}`;
    }

    if (projectId) {
      uri += `&projectId=${projectId}`;
    }

    if (method) {
      uri += `&method=${method}`;
    }

    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerMeetingEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      total: response?.total,
      error,
      isLoading,
      mutate,
    };
  },
  useById(id?: string) {
    const uri = id ? `${url.base}/${id}` : null;
    const { data: response, error, isLoading, mutate } = useSWR<ProjectManagerMeetingDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  async create(body: ProjectManagerCreateMeetingDto) {
    const response: ProjectManagerCreateMeetingResponseEntity = await http.post(url.base, body, null);
    return response;
  },
  async update(id: string, body: ProjectManagerUpdateMeetingDto) {
    const response: ProjectManagerUpdateMeetingResponseEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
  async delete(id: string) {
    const response: ProjectManagerDeleteMeetingResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectManagerMeetingRepository = {
  url,
  hooks,
  api,
};
