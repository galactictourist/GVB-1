import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { AdminEntity } from '~/user/entity/admin.entity';
import { AdminRole, AdminStatus } from '~/user/types';

export function createAdmin(oriData: DeepPartial<AdminEntity> = {}) {
  const data: DeepPartial<AdminEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.username =
    data.username ?? faker.helpers.unique(faker.internet.userName);
  data.password =
    data.password ?? bcrypt.hashSync(faker.internet.password(10), 12);
  data.role = data.role ?? faker.helpers.arrayElement(Object.values(AdminRole));
  data.status =
    data.status ?? faker.helpers.arrayElement(Object.values(AdminStatus));
  return AdminEntity.create<AdminEntity>(data);
}

export async function createAdminEntity(data: DeepPartial<AdminEntity> = {}) {
  const user = await AdminEntity.save(createAdmin(data));
  return user;
}

export async function createAdminEntities(
  data: DeepPartial<AdminEntity> = {},
  count: number,
) {
  const instances: DeepPartial<AdminEntity>[] = _.range(count).map(() =>
    createAdmin(data),
  );

  const entities = await AdminEntity.save(instances);
  return entities;
}
