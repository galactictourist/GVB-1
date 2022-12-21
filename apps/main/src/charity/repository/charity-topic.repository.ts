import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '~/lib/database/base-repository';
import { CountryCode } from '~/types/country';
import { CharityTopicEntity } from '../entity/charity-topic.entity';

@Injectable()
export class CharityTopicRepository extends BaseRepository<CharityTopicEntity> {
  constructor(private dataSource: DataSource) {
    super(CharityTopicEntity, dataSource.createEntityManager());
  }

  async findOneByCharityTopicCountry(
    charityId: string,
    topicId: string,
    countryCode: CountryCode,
  ) {
    const user = await this.findOneBy({
      topicId,
      charityId,
      countryCode,
    });
    return user;
  }
}
