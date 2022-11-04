import { Injectable } from '@nestjs/common';
import { DataSource, Raw, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findOneByWallet(wallet: string) {
    const user = await this.findOneBy({
      wallet: Raw((alias) => `LOWER(${alias}) = LOWER(:wallet)`, { wallet }),
    });
    return user;
  }

  async findOrCreateOneByWallet(wallet: string) {
    let user = await this.findOneByWallet(wallet);
    if (!user) {
      user = this.create({ wallet });
      await this.save(user);
    }
    return user;
  }
}
