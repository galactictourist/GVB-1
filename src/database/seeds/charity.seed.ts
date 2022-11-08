import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { CharityEntity } from '~/charity/entity/charity.entity';
import { CharityStatus } from '~/charity/types';
import { faker } from '~/lib';

export function createCharity(oriData: DeepPartial<CharityEntity> = {}) {
  const data: DeepPartial<CharityEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.status =
    data.status ?? faker.random.arrayElement(Object.values(CharityStatus));
  data.name = data.name ?? faker.company.companyName();
  return CharityEntity.create(data);
}

export async function createCharityEntity(
  data: DeepPartial<CharityEntity> = {},
) {
  const entity = await CharityEntity.save(createCharity(data));
  return entity;
}

export async function createCharityEntities(
  data: DeepPartial<CharityEntity> = {},
  count: number,
) {
  const instances: DeepPartial<CharityEntity>[] = _.range(count).map(() =>
    createCharity(data),
  );

  const entities = await CharityEntity.save(instances);
  return entities;
}
