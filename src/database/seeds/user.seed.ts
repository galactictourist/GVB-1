import { DeepPartial } from 'typeorm';
import { generateWallets } from '~/lib/web3';
import { UserEntity } from '~/user/entity/user.entity';

export async function userSeed(count = 200) {
  const wallets = generateWallets(
    'beyond left mechanic arrow federal long recycle promote reform doctor plate elder',
    count,
  );

  const data: DeepPartial<UserEntity>[] = wallets.map((wallet) => {
    return {
      wallet: wallet.address,
    };
  });

  console.debug(data);
  const users = await UserEntity.save(data);
  console.debug(users);
  return users;
}
