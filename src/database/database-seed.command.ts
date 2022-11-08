import _ from 'lodash';
import { Command, CommandRunner } from 'nest-commander';
import { NonceRepository } from '~/auth/repository/nonce.repository';
import { CharityTopicRepository } from '~/charity/repository/charity-topic.repository';
import { CharityRepository } from '~/charity/repository/charity.repository';
import { TopicRepository } from '~/charity/repository/topic.repository';
import { faker } from '~/lib';
import { CollectionRepository } from '~/nft/repository/collection.repository';
import { NftRepository } from '~/nft/repository/nft.repository';
import { BlockchainNetwork } from '~/types/blockchain';
import { UserStatus } from '~/user/types';
import { UserRepository } from '../user/repository/user.repository';
import { createCharityEntities } from './seeds/charity.seed';
import { createCollectionEntities } from './seeds/collection.seed';
import { createNftEntities } from './seeds/nft.seed';
import { createTopicEntities } from './seeds/topic.seed';
import { createUserEntities } from './seeds/user.seed';

@Command({ name: 'db:seed', description: 'Seed database' })
export class DatabaseSeedCommand extends CommandRunner {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly nftRepository: NftRepository,
    private readonly nonceRepository: NonceRepository,
    private readonly charityRepository: CharityRepository,
    private readonly topicRepository: TopicRepository,
    private readonly charityTopicRepository: CharityTopicRepository,
  ) {
    super();
  }

  async run() {
    await this.clear();
    await this.seed();
  }

  async clear() {
    await this.charityTopicRepository.deleteAll();
    await this.topicRepository.deleteAll();
    await this.charityRepository.deleteAll();
    await this.nftRepository.deleteAll();
    await this.collectionRepository.deleteAll();
    await this.userRepository.deleteAll();
    await this.nonceRepository.deleteAll();
  }

  async seed() {
    faker.seed(7423981289123);
    const userEntities = await createUserEntities(
      { status: UserStatus.ACTIVE },
      100,
    );
    const userList1 = _.slice(userEntities, 0, 20);
    await Promise.all(
      userList1.map(async (user) => {
        const collectionEntities = await createCollectionEntities(
          { ownerId: user.id },
          20,
        );
        await Promise.all(
          collectionEntities.map(async (collectionEntity) => {
            const nftEntities = await createNftEntities(
              {
                network: BlockchainNetwork.POLYGON_MUMBAI,
                ownerId: user.id,
                collectionId: collectionEntity.id,
              },
              10,
            );
            return nftEntities;
          }),
        );
      }),
    );
    const topicEntities = await createTopicEntities({}, 5);
    const childrenTopicEntities = await Promise.all(
      topicEntities.map(async (topicEntity) => {
        return await createTopicEntities({ parentId: topicEntity.id }, 5);
      }),
    );

    const charityEntities = await createCharityEntities({}, 100);
  }
}
