import { http } from '@/utils/http';
import { LoginDTO } from './dto/login.dto';
import { LoginEntity } from './entities/login.entity';

const url = {
  base: '/auth',
};

const hooks = {};

const api = {
  login: async (body: LoginDTO) => {
    const response: LoginEntity = await http.post(`${url.base}/login`, body, null);

    return response;
  },
};

export const AuthRepository = {
  url,
  hooks,
  api,
};
