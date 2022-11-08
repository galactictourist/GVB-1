import { faker } from '@faker-js/faker';
import { utils, Wallet } from 'ethers';
import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { UserEntity } from '~/user/entity/user.entity';

export function createUser(oriData: DeepPartial<UserEntity> = {}) {
  const data: DeepPartial<UserEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.wallet = data.wallet ?? generateWallet().address;
  return UserEntity.create<UserEntity>(data);
}

export async function createUserEntity(data: DeepPartial<UserEntity> = {}) {
  const user = await UserEntity.save(createUser(data));
  return user;
}

let walletIndex = 0;

const hdNode = utils.HDNode.fromMnemonic(
  'beyond left mechanic arrow federal long recycle promote reform doctor plate elder',
);

export function generateWallet(options?: { index?: number }) {
  let node;
  if (options?.index === undefined) {
    node = hdNode.derivePath(`m/44'/60'/0'/0/${walletIndex}`);
    walletIndex++;
  } else {
    node = hdNode.derivePath(`m/44'/60'/0'/0/${options.index}`);
  }
  return new Wallet(node.privateKey);
}

export async function createUserEntities(
  data: DeepPartial<UserEntity> = {},
  count: number,
) {
  const instances: DeepPartial<UserEntity>[] = _.range(count).map(() =>
    createUser(data),
  );

  const entities = await UserEntity.save(instances);
  return entities;
}
