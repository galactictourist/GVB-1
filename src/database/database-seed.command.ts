import { Command, CommandRunner } from 'nest-commander';
import { UserRepository } from '../user/repository/user.repository';

@Command({ name: 'db:seed', description: 'Seed database' })
export class DatabaseSeedCommand extends CommandRunner {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async run() {
    await this.clear();
  }

  async clear() {
    await this.userRepository.deleteAll();
  }

  async seed() {
    // TODO add seed
  }
}
