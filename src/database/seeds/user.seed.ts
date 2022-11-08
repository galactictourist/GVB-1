import { utils, Wallet } from 'ethers';
import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { UserEntity } from '~/user/entity/user.entity';

export function createUserEntity(oriData: DeepPartial<UserEntity> = {}) {
  const data: DeepPartial<UserEntity> = { ...oriData };
  data.wallet = data.wallet ?? generateWallet().address;
  return UserEntity.create(data);
}

export async function createUser(data: DeepPartial<UserEntity> = {}) {
  const user = await UserEntity.save(createUserEntity(data));
  return user;
}

let walletIndex = 0;

const hdNode = utils.HDNode.fromMnemonic(
  'beyond left mechanic arrow federal long recycle promote reform doctor plate elder',
);

function generateWallet(index?: number) {
  let node;
  if (index === undefined) {
    node = hdNode.derivePath(`m/44'/60'/0'/0/${walletIndex}`);
    walletIndex++;
  } else {
    node = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);
  }
  return new Wallet(node.privateKey);
}

export async function createUsers(
  data: DeepPartial<UserEntity> = {},
  count = 1,
) {
  const users: DeepPartial<UserEntity>[] = _.range(count).map(() =>
    createUserEntity(data),
  );

  const userEntities = await UserEntity.save(users);
  return userEntities;
}
