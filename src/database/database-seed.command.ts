import { Command, CommandRunner } from 'nest-commander';
import { NonceRepository } from '~/auth/repository/nonce.repository';
import { CharityTopicRepository } from '~/charity/repository/charity-topic.repository';
import { CharityRepository } from '~/charity/repository/charity.repository';
import { TopicRepository } from '~/charity/repository/topic.repository';
import { CollectionRepository } from '~/nft/repository/collection.repository';
import { NftRepository } from '~/nft/repository/nft.repository';
import { UserStatus } from '~/user/types';
import { UserRepository } from '../user/repository/user.repository';
import { createUsers } from './seeds/user.seed';

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
    await this.userRepository.deleteAll();
    await this.nonceRepository.deleteAll();
    await this.nftRepository.deleteAll();
    await this.collectionRepository.deleteAll();
    await this.charityTopicRepository.deleteAll();
    await this.topicRepository.deleteAll();
    await this.charityRepository.deleteAll();
  }

  async seed() {
    await createUsers({ status: UserStatus.ACTIVE }, 100);
  }
}
