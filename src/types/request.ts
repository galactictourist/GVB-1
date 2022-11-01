import { Expose, plainToClass } from 'class-transformer';
import { Request } from 'express';
import { User } from '~/user/entity/user.entity';

export interface AuthedRequest extends Request {
  user: ContextUser;
}

export class ContextUser {
  @Expose()
  id: string;

  @Expose()
  wallet: string;

  public static fromEntity(fromUser: User): ContextUser {
    const contextUser = plainToClass(ContextUser, fromUser, {
      excludeExtraneousValues: true,
    });
    return contextUser;
  }
}
