import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreateOneByWallet(wallet: string) {
    const user = await this.userRepository.findOrCreateOneByWallet(wallet);
    return user;
  }

  async findOneByWallet(wallet: string) {
    const user = await this.userRepository.findOneByWallet(wallet);
    return user;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }
}
