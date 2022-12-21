import { Expose, plainToClass } from 'class-transformer';
import { Request } from 'express';
import { UserEntity } from '~/main/user/entity/user.entity';

export interface UserRequest extends Request {
  user: ContextUser;
}

export interface ContextUserInterface {
  id: string;
  wallet?: string;
}

export class ContextUser implements ContextUserInterface {
  @Expose()
  id: string;

  @Expose()
  wallet?: string;

  static fromEntity(fromUser: UserEntity): ContextUser {
    const contextUser = plainToClass(ContextUser, fromUser, {
      excludeExtraneousValues: true,
    });
    return contextUser;
  }
}
