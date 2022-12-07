import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOrCreateOneByWallet(wallet: string) {
    const user = await this.userRepository.findOrCreateOneByWallet(wallet);
    return user;
  }

  async validateUser(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    if (!user.isActive()) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }
}
