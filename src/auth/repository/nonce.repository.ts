import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import * as randomstring from 'randomstring';
import { DataSource, MoreThan } from 'typeorm';
import { IAuthConfig } from '~/config/auth.config';
import { BaseRepository } from '~/lib/database/base-repository';
import { ConfigNamespace } from '~/types/config';
import { NonceEntity } from '../entity/nonce.entity';

@Injectable()
export class NonceRepository extends BaseRepository<NonceEntity> {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  constructor(private dataSource: DataSource) {
    super(NonceEntity, dataSource.createEntityManager());
  }

  async createNonceForAuthSignin(wallet: string) {
    const authConfig = this.configService.getOrThrow<IAuthConfig>(
      ConfigNamespace.AUTH,
    );
    const code = `auth:signin:${wallet}`;
    const otp = randomstring.generate({ length: 12 });
    const message = `Verification code: ${otp}\nClick SIGN to sign-in`;
    const nonce = this.create({
      code,
      data: message,
      expiredAt: DateTime.now()
        .plus({ seconds: authConfig.signIn.nonceTtl })
        .toJSDate(),
    });
    await this.save(nonce);
    return nonce;
  }

  async getMessageForAuthSignin(wallet: string) {
    const code = `auth:signin:${wallet}`;
    const nonce = await this.findOneBy({
      code,
      expiredAt: MoreThan(new Date()),
    });
    return nonce;
  }
}
