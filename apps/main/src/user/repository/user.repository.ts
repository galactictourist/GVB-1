import { Injectable } from '@nestjs/common';
import { DataSource, Raw } from 'typeorm';
import { BaseRepository } from '~/main/lib/database/base-repository';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findOneByWallet(wallet: string) {
    const user = await this.findOneByOrFail({
      wallet: Raw((alias) => `LOWER(${alias}) = LOWER(:wallet)`, { wallet }),
    });
    return user;
  }

  async findOrCreateOneByWallet(wallet: string) {
    try {
      const user = await this.findOneByWallet(wallet);
      return user;
    } catch (error) {
      const user = this.create({ wallet });
      await this.save(user);
      return user;
    }
  }
}
