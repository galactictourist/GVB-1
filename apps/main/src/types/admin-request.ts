import { Expose, plainToClass } from 'class-transformer';
import { Request } from 'express';
import { AdminEntity } from '~/main/user/entity/admin.entity';
import { AdminRole, AdminStatus } from '~/main/user/types';

export interface AdminRequest extends Request {
  user: ContextAdmin;
}

export interface ContextAdminInterface {
  id: string;
  username: string;
  role: AdminRole;
  status: AdminStatus;
}

export class ContextAdmin implements ContextAdminInterface {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  role: AdminRole;

  @Expose()
  status: AdminStatus;

  static fromEntity(fromAdmin: AdminEntity): ContextAdmin {
    const contextAdmin = plainToClass(ContextAdmin, fromAdmin, {
      excludeExtraneousValues: true,
    });
    return contextAdmin;
  }
}
