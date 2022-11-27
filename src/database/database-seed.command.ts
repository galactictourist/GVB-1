import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { Command, CommandRunner } from 'nest-commander';
import { NonceRepository } from '~/auth/repository/nonce.repository';
import { CharityTopicEntity } from '~/charity/entity/charity-topic.entity';
import { TopicEntity } from '~/charity/entity/topic.entity';
import { CharityTopicRepository } from '~/charity/repository/charity-topic.repository';
import { CharityRepository } from '~/charity/repository/charity.repository';
import { TopicRepository } from '~/charity/repository/topic.repository';
import { CollectionRepository } from '~/nft/repository/collection.repository';
import { NftRepository } from '~/nft/repository/nft.repository';
import { BlockchainNetwork } from '~/types/blockchain';
import { AdminRepository } from '~/user/repository/admin.repository';
import { AdminRole, AdminStatus, UserStatus } from '~/user/types';
import { UserRepository } from '../user/repository/user.repository';
import { createAdminEntities, createAdminEntity } from './seeds/admin.seed';
import { createCharityTopic } from './seeds/charity-topic.seed';
import { createCharityEntities } from './seeds/charity.seed';
import { createCollectionEntities } from './seeds/collection.seed';
import { createNftEntities } from './seeds/nft.seed';
import { createTopicEntities } from './seeds/topic.seed';
import { createUserEntities } from './seeds/user.seed';

@Command({ name: 'db:seed', description: 'Seed database' })
export class DatabaseSeedCommand extends CommandRunner {
  constructor(
    private readonly adminRepository: AdminRepository,
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
    await this.adminRepository.deleteAll();
    await this.charityTopicRepository.deleteAll();
    await this.topicRepository.deleteAll();
    await this.charityRepository.deleteAll();
    await this.nftRepository.deleteAll();
    await this.collectionRepository.deleteAll();
    await this.userRepository.deleteAll();
    await this.nonceRepository.deleteAll();
  }

  async seed() {
    faker.seed(2345);
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
    const childrenTopicEntitiesFlat: TopicEntity[] = [];
    childrenTopicEntities.forEach((c) => {
      childrenTopicEntitiesFlat.push(...c);
    });

    const charityEntities = await createCharityEntities({}, 100);
    const charityTopicEntities: CharityTopicEntity[] = [];
    const charityEntitiesChunk1 = charityEntities.slice(0, 20);
    charityEntitiesChunk1.forEach((charity) => {
      faker.helpers
        .arrayElements(childrenTopicEntitiesFlat, 5)
        .forEach((childTopic) => {
          charityTopicEntities.push(
            createCharityTopic({
              topicId: childTopic.id,
              charityId: charity.id,
              network: BlockchainNetwork.POLYGON_MUMBAI,
            }),
          );
        });
    });
    const charityEntitiesChunk2 = charityEntities.slice(20, 40);
    charityEntitiesChunk2.forEach((charity) => {
      faker.helpers
        .arrayElements(childrenTopicEntitiesFlat, 10)
        .forEach((childTopic) => {
          charityTopicEntities.push(
            createCharityTopic({
              topicId: childTopic.id,
              charityId: charity.id,
              network: BlockchainNetwork.POLYGON_MUMBAI,
            }),
          );
        });
    });
    const charityEntitiesChunk3 = charityEntities.slice(40, 60);
    charityEntitiesChunk3.forEach((charity) => {
      faker.helpers
        .arrayElements(childrenTopicEntitiesFlat, 15)
        .forEach((childTopic) => {
          charityTopicEntities.push(
            createCharityTopic({
              topicId: childTopic.id,
              charityId: charity.id,
              network: BlockchainNetwork.POLYGON_MUMBAI,
            }),
          );
        });
    });
    const charityEntitiesChunk4 = charityEntities.slice(60, 80);
    charityEntitiesChunk4.forEach((charity) => {
      faker.helpers
        .arrayElements(childrenTopicEntitiesFlat, 25)
        .forEach((childTopic) => {
          charityTopicEntities.push(
            createCharityTopic({
              topicId: childTopic.id,
              charityId: charity.id,
              network: BlockchainNetwork.POLYGON_MUMBAI,
            }),
          );
        });
    });
    await CharityTopicEntity.save(charityTopicEntities);

    await createAdminEntity({
      username: 'sadmin',
      password: '$2a$12$2AQML.1jOi1sG58ZbpMrSus6cGgIi/aWGo663QwMU82Jz4HquiQTW',
      role: AdminRole.SUPER_ADMIN,
      status: AdminStatus.ACTIVE,
    });
    await createAdminEntity({
      username: 'admin',
      password: '$2a$12$2AQML.1jOi1sG58ZbpMrSus6cGgIi/aWGo663QwMU82Jz4HquiQTW',
      role: AdminRole.ADMIN,
      status: AdminStatus.ACTIVE,
    });
    await createAdminEntities({}, 20);
  }
}
