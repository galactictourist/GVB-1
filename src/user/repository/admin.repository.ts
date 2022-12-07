import { Injectable } from '@nestjs/common';
import { DataSource, Raw } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { AdminEntity } from '../entity/admin.entity';

@Injectable()
export class AdminRepository extends BaseRepository<AdminEntity> {
  constructor(private dataSource: DataSource) {
    super(AdminEntity, dataSource.createEntityManager());
  }

  async findOneByUsername(username: string) {
    const user = await this.findOneByOrFail({
      username: Raw((alias) => `LOWER(${alias}) = LOWER(:username)`, {
        username,
      }),
    });
    return user;
  }
}
