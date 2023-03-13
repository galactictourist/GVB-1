import { faker } from '@faker-js/faker';
import { range } from 'lodash';
import { DeepPartial } from 'typeorm';
import { TopicEntity } from '~/main/charity/entity/topic.entity';

export function createTopic(oriData: DeepPartial<TopicEntity> = {}) {
  const data: DeepPartial<TopicEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.name = data.name ?? faker.word.noun();
  return TopicEntity.create<TopicEntity>(data);
}

export async function createTopicEntity(data: DeepPartial<TopicEntity> = {}) {
  const entity = await TopicEntity.save(createTopic(data));
  return entity;
}

export async function createTopicEntities(
  data: DeepPartial<TopicEntity> = {},
  count: number,
) {
  const instances: DeepPartial<TopicEntity>[] = range(count).map(() =>
    createTopic(data),
  );

  const entities = await TopicEntity.save(instances);
  return entities;
}
