import { NonceEntity } from '../auth/entity/nonce.entity';
import { EventProcessEntity } from '../blockchain/entity/event-process.entity';
import { CharityTopicEntity } from '../charity/entity/charity-topic.entity';
import { CharityEntity } from '../charity/entity/charity.entity';
import { TopicEntity } from '../charity/entity/topic.entity';
import { OrderEntity } from '../marketplace/entity/order.entity';
import { SaleEntity } from '../marketplace/entity/sale.entity';
import { CollectionEntity } from '../nft/entity/collection.entity';
import { NftEntity } from '../nft/entity/nft.entity';
import { StorageEntity } from '../storage/entity/storage.entity';
import { AdminEntity } from '../user/entity/admin.entity';
import { UserEntity } from '../user/entity/user.entity';

export const entities = [
  NonceEntity,
  EventProcessEntity,
  CharityEntity,
  TopicEntity,
  CharityTopicEntity,
  SaleEntity,
  OrderEntity,
  CollectionEntity,
  NftEntity,
  StorageEntity,
  UserEntity,
  AdminEntity,
];
