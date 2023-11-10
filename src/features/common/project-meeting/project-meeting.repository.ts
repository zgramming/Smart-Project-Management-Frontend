import { IBaseQueryParams } from '@/interface/base_query_params.interface';
import { ProjectMeetingEntity } from './entities/project-meeting.entity';
import { ProjectMeetingDetailEntity } from './entities/project-meeting-detail.entity';
import { http } from '@/utils/http';
import useSWR from 'swr';
import { ProjectMeetingCreateDTO } from './dto/project-meeting-create.dto';
import { ProjectMeetingUpdateDTO } from './dto/project-meeting-update.dto';
import { ProjectMeetingCreateResponseEntity } from './entities/project-meeting-create-response.entity';
import { ProjectMeetingUpdateResponseEntity } from './entities/project-meeting-update-response.entity';
import { ProjectMeetingDeleteResponseEntity } from './entities/project-meeting-delete-response.entity';

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
    let uri = `${url.base}?page=${page}&limit=${pageSize}`;

    if (name && name.length > 0) {
      uri += `&name=${name}`;
    }

    if (projectId) {
      uri += `&projectId=${projectId}`;
    }

    if (method) {
      uri += `&method=${method}`;
    }

    const { data: response, error, isLoading, mutate } = useSWR<ProjectMeetingEntity>(uri, http.fetcher);
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
    const { data: response, error, isLoading, mutate } = useSWR<ProjectMeetingDetailEntity>(uri, http.fetcher);
    return {
      data: response?.data,
      error,
      isLoading,
      mutate,
    };
  },
};

const api = {
  async create(body: ProjectMeetingCreateDTO) {
    const response: ProjectMeetingCreateResponseEntity = await http.post(url.base, body, null);
    return response;
  },
  async update(id: string, body: ProjectMeetingUpdateDTO) {
    const response: ProjectMeetingUpdateResponseEntity = await http.patch(`${url.base}/${id}`, body, null);
    return response;
  },
  async delete(id: string) {
    const response: ProjectMeetingDeleteResponseEntity = await http.del(`${url.base}/${id}`, null);
    return response;
  },
};

export const ProjectMeetingRepository = {
  url,
  hooks,
  api,
};
