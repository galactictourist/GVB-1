import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig } from '~/config/jwt.config';
import { ContextAdmin } from '~/types/admin-request';
import { ConfigNamespace } from '~/types/config';
import { ContextUser } from '~/types/user-request';
import { AdminService } from '~/user/admin.service';
import { UserEntity } from '~/user/entity/user.entity';
import { UserService } from '~/user/user.service';
import { CreateNonceDto } from './dto/create-nonce.dto';
import { NonceRepository } from './repository/nonce.repository';
import { SignatureVerifierService } from './signature-verifier.service';
import { JwtPurpose } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly nonceRepository: NonceRepository,
    private readonly userService: UserService,
    private readonly adminUserService: AdminService,
    private readonly signatureVerifierService: SignatureVerifierService,
  ) {}

  async signIn(type: string, user: ContextUser) {
    const payload = {
      type: type,
      wallet: user.wallet,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);
    return {
      user,
      accessToken: token,
    };
  }

  async signInNonce(createNonceDto: CreateNonceDto) {
    const { wallet } = createNonceDto;
    const nonce = await this.nonceRepository.createNonceForAuthSignin(wallet);
    return { message: nonce.data };
  }

  async adminSignIn(admin: ContextAdmin) {
    const payload = {
      purpose: JwtPurpose.ADMIN,
      username: admin.username,
      role: admin.role,
      sub: admin.id,
    };

    const jwtConfig = this.configService.getOrThrow<IJwtConfig>(
      ConfigNamespace.JWT,
    );
    const token = this.jwtService.sign(payload, {
      algorithm: jwtConfig.admin.algo,
      privateKey: jwtConfig.admin.privateKey,
    });
    return {
      user: admin,
      accessToken: token,
    };
  }

  async validateWallet(wallet: string, signature: string): Promise<UserEntity> {
    const nonce = await this.nonceRepository.getMessageForAuthSignin(wallet);
    if (!nonce) {
      throw new UnauthorizedException();
    }
    await this.nonceRepository.delete({ id: nonce.id });
    const valid = await this.signatureVerifierService.verify(
      nonce.data,
      wallet,
      signature,
    );
    if (!valid) {
      throw new UnauthorizedException('Invalid signature');
    }
    const user = await this.userService.findOrCreateOneByWallet(wallet);
    if (!user) {
      throw new UnauthorizedException('Wallet is not registered');
    }
    if (!user.isActive()) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
