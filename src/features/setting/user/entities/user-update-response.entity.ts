import { UserCreateResponseEntity } from './user-create-response.entity';

export interface UserUpdateResponseEntity extends Partial<UserCreateResponseEntity> {}
