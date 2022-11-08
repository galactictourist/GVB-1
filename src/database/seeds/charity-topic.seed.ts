import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { CharityTopicEntity } from '~/charity/entity/charity-topic.entity';
import { generateWallet } from './user.seed';

export function createCharityTopic(
  oriData: DeepPartial<CharityTopicEntity> = {},
) {
  const data: DeepPartial<CharityTopicEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.countryCode = data.countryCode ?? faker.address.countryCode();
  data.wallet =
    data.wallet === undefined && data.network
      ? generateWallet().address
      : undefined;
  return CharityTopicEntity.create(data);
}

export async function createCharityTopicEntity(
  data: DeepPartial<CharityTopicEntity> = {},
) {
  const entity = await CharityTopicEntity.save(createCharityTopic(data));
  return entity;
}

export async function createCharityTopicEntities(
  data: DeepPartial<CharityTopicEntity> = {},
  count: number,
) {
  const instances: DeepPartial<CharityTopicEntity>[] = _.range(count).map(() =>
    createCharityTopic(data),
  );

  const entities = await CharityTopicEntity.save(instances);
  return entities;
}
