import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig } from '~/main/config/jwt.config';
import { JwtAdminAuthPayload } from '~/main/types';
import { ContextAdmin } from '~/main/types/admin-request';
import { ConfigNamespace } from '~/main/types/config';
import { AdminService } from '~/main/user/admin.service';
import { JwtPurpose } from '../types';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {
    const jwtConfig = configService.getOrThrow<IJwtConfig>(ConfigNamespace.JWT);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.admin.privateKey,
      algorithms: [jwtConfig.admin.algo],
    });
  }

  async validate(payload: JwtAdminAuthPayload) {
    if (payload.purpose !== JwtPurpose.ADMIN) {
      throw new UnauthorizedException();
    }
    const admin = await this.adminService.validateAdminById(payload.sub);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return ContextAdmin.fromEntity(admin);
  }
}
