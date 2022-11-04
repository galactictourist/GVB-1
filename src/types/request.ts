import { Expose, plainToClass } from 'class-transformer';
import { Request } from 'express';
import { UserEntity } from '~/user/entity/user.entity';

export interface UserRequest extends Request {
  user: ContextUser;
}

export class ContextUser {
  @Expose()
  id: string;

  @Expose()
  wallet: string;

  public static fromEntity(fromUser: UserEntity): ContextUser {
    const contextUser = plainToClass(ContextUser, fromUser, {
      excludeExtraneousValues: true,
    });
    return contextUser;
  }
}
