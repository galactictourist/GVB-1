import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { TopicEntity } from '~/charity/entity/topic.entity';
import { faker } from '~/lib';

export function createTopic(oriData: DeepPartial<TopicEntity> = {}) {
  const data: DeepPartial<TopicEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.name = data.name ?? faker.lorem.words();
  return TopicEntity.create(data);
}

export async function createTopicEntity(data: DeepPartial<TopicEntity> = {}) {
  const entity = await TopicEntity.save(createTopic(data));
  return entity;
}

export async function createTopicEntities(
  data: DeepPartial<TopicEntity> = {},
  count: number,
) {
  const instances: DeepPartial<TopicEntity>[] = _.range(count).map(() =>
    createTopic(data),
  );

  const entities = await TopicEntity.save(instances);
  return entities;
}
