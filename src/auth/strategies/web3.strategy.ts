import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ContextUser } from '~/types/request';
import { UserStatus } from '~/user/types';
import { AuthService } from '../auth.service';

@Injectable()
export class Web3Strategy extends PassportStrategy(Strategy, 'web3') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'wallet', passwordField: 'signature' });
  }

  async validate(wallet: string, signature: string): Promise<ContextUser> {
    const user = await this.authService.validateWallet(wallet, signature);
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }
    return ContextUser.fromEntity(user);
  }
}
