import { http } from '@/utils/http';
import { CreateProjectDto } from './dto/create-project.dto';

const url = {
  base: '/project',
};

const hooks = {};

const api = {
  create: async (data: CreateProjectDto) => {
    const response = await http.post(`${url.base}`, data, null);
    return response;
  },
};

export const ProjectManagerProjectRepository = {
  url,
  hooks,
  api,
};
