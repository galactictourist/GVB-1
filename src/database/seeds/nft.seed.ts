import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { DeepPartial } from 'typeorm';
import { NftEntity } from '~/nft/entity/nft.entity';
import { NftStatus } from '~/nft/types';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/types/blockchain';

export function createNft(oriData: DeepPartial<NftEntity> = {}) {
  const data: DeepPartial<NftEntity> = { ...oriData };
  data.id = data.id ?? faker.datatype.uuid();
  data.network =
    data.network ??
    faker.helpers.arrayElement(Object.values(BlockchainNetwork));
  data.scAddress =
    data.scAddress ?? BLOCKCHAIN_INFO[data.network].constract.erc721;
  data.tokenId =
    data.tokenId ?? getTokenId(data.network, data.scAddress).toString();
  data.status =
    data.status ?? faker.helpers.arrayElement(Object.values(NftStatus));

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
  const instances: DeepPartial<NftEntity>[] = _.range(count).map(() =>
    createNft(data),
  );

  const entities = await NftEntity.save(instances);
  return entities;
}
