import { faker } from '@faker-js/faker';
import { range } from 'lodash';
import { DeepPartial } from 'typeorm';
import { CharityTopicEntity } from '~/charity/entity/charity-topic.entity';
import { CountryCode } from '~/types/country';
import { generateWallet } from './user.seed';

export function createCharityTopic(
  oriData: DeepPartial<CharityTopicEntity> = {},
) {
  const data: DeepPartial<CharityTopicEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.countryCode =
    data.countryCode ?? faker.helpers.arrayElement(Object.values(CountryCode));
  data.wallet =
    data.wallet === undefined && data.network
      ? generateWallet().address
      : undefined;
  return CharityTopicEntity.create<CharityTopicEntity>(data);
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
  const instances: DeepPartial<CharityTopicEntity>[] = range(count).map(() =>
    createCharityTopic(data),
  );

  const entities = await CharityTopicEntity.save(instances);
  return entities;
}
