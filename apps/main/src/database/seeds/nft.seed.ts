import { faker } from '@faker-js/faker';
import { range } from 'lodash';
import { DeepPartial } from 'typeorm';
import { NftEntity } from '~/main/nft/entity/nft.entity';
import { NftStatus } from '~/main/nft/types';
import {
  BlockchainNetwork,
  getErc721SmartContract
} from '~/main/types/blockchain';

export function createNft(oriData: DeepPartial<NftEntity> = {}) {
  const data: DeepPartial<NftEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.name = data.name ?? faker.music.songName();
  data.network =
    data.network ??
    faker.helpers.arrayElement(Object.values(BlockchainNetwork));
  data.scAddress =
    data.scAddress ?? getErc721SmartContract(data.network).address;
  data.tokenId =
    data.tokenId ?? getTokenId(data.network, data.scAddress);
  data.status =
    data.status ?? faker.helpers.arrayElement(Object.values(NftStatus));
  data.royalty = data.royalty ?? faker.datatype.number({ min: 0, max: 5000 });

  return NftEntity.create<NftEntity>(data);
}

export async function createNftEntity(data: DeepPartial<NftEntity> = {}) {
  const user = await NftEntity.save(createNft(data));
  return user;
}

interface SmartcontractTokenIncremment {
  [key: string]: number;
}

const increment: { [key in BlockchainNetwork]: SmartcontractTokenIncremment } =
  {
    [BlockchainNetwork.POLYGON_MUMBAI]: {},
    [BlockchainNetwork.BSC_TESTNET]: {},
  };

function getTokenId(network: BlockchainNetwork, scAddress: string) {
  if (increment[network][scAddress] === undefined) {
    increment[network][scAddress] = 0;
  }
  return ++increment[network][scAddress];
}

export async function createNftEntities(
  data: DeepPartial<NftEntity> = {},
  count: number,
) {
  const instances: DeepPartial<NftEntity>[] = range(count).map(() =>
    createNft(data),
  );

  const entities = await NftEntity.save(instances);
  return entities;
}
