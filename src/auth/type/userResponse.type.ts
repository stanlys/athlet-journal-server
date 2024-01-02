import { UserEntity } from '../schema/createUser.schema';

export type UserResponseType = Omit<UserEntity, 'password'>;
