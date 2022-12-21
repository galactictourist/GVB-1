import { faker } from '@faker-js/faker';
import { range } from 'lodash';
import { DeepPartial } from 'typeorm';
import { CollectionEntity } from '~/main/nft/entity/collection.entity';
import { CollectionStatus } from '~/main/nft/types';

export function createCollection(oriData: DeepPartial<CollectionEntity> = {}) {
  const data: DeepPartial<CollectionEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.status =
    data.status ?? faker.helpers.arrayElement(Object.values(CollectionStatus));
  data.name = data.name ?? faker.commerce.productName();
  return CollectionEntity.create<CollectionEntity>(data);
}

export async function createCollectionEntity(
  data: DeepPartial<CollectionEntity> = {},
) {
  const entity = await CollectionEntity.save(createCollection(data));
  return entity;
}

export async function createCollectionEntities(
  data: DeepPartial<CollectionEntity> = {},
  count: number,
) {
  const instances: DeepPartial<CollectionEntity>[] = range(count).map(() =>
    createCollection(data),
  );

  const entities = await CollectionEntity.save(instances);
  return entities;
}
