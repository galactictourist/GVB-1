import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtConfig } from '~/config/jwt.config';
import { JwtAuthPayload } from '~/types';
import { ConfigNamespace } from '~/types/config';
import { ContextUser } from '~/types/user-request';
import { UserService } from '~/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const jwtConfig = configService.getOrThrow<IJwtConfig>(ConfigNamespace.JWT);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.privateKey,
      algorithms: [jwtConfig.algo],
    });
  }

  async validate(payload: JwtAuthPayload) {
    const user = await this.userService.validateUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return ContextUser.fromEntity(user);
  }
}
