import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig } from '~/config/jwt.config';
import { JwtAdminAuthPayload } from '~/types';
import { ContextAdmin } from '~/types/admin-request';
import { ConfigNamespace } from '~/types/config';
import { AdminService } from '~/user/admin.service';
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
      secretOrKey: jwtConfig.privateKey,
      algorithms: [jwtConfig.algo],
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
