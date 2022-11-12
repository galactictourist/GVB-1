import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ContextUser } from '~/types/request';
import { UserEntity } from '~/user/entity/user.entity';
import { UserService } from '~/user/user.service';
import { CreateNonceDto } from './dto/create-nonce.dto';
import { NonceRepository } from './repository/nonce.repository';
import { SignatureVerifierService } from './signature-verifier.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly nonceRepository: NonceRepository,
    private readonly userService: UserService,
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

  async validateWallet(wallet: string, signature: string): Promise<UserEntity> {
    const nonce = await this.nonceRepository.getMessageForAuthSignin(wallet);
    if (nonce) {
      const valid = await this.signatureVerifierService.verify(
        nonce.data,
        wallet,
        signature,
      );
      if (valid) {
        const user = await this.userService.findOrCreateOneByWallet(wallet);
        if (user) {
          nonce.expiredAt = new Date();
          await this.nonceRepository.delete({ id: nonce.id });
          return user;
        } else {
          throw new UnauthorizedException('Wallet is not registered');
        }
      }
      throw new UnauthorizedException('Invalid signature');
    } else {
      throw new UnauthorizedException('Invalid nonce');
    }
  }
}
