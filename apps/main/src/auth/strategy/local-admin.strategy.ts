import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ContextAdmin } from '~/main/types/admin-request';
import { AdminService } from '~/main/user/admin.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private adminService: AdminService) {
    super();
  }

  async validate(username: string, password: string): Promise<ContextAdmin> {
    const admin = await this.adminService.validateAdmin(username, password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return ContextAdmin.fromEntity(admin);
  }
}
