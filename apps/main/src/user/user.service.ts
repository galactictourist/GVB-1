import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextUser } from '../types/user-request';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async findOrCreateOneByWallet(wallet: string) {
    const user = await this.userRepository.findOrCreateOneByWallet(wallet);
    return user;
  }

  async findUserByWallet(wallet: string) {
    const user = await this.userRepository.findOneBy({ wallet: wallet });
    return user;
  }

  async validateUser(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id });
    if (!user.isActive()) {
      throw new UnauthorizedException('User is not active');
    }
    return user;
  }

  async updateUser(id: string, userDto: UpdateUserDto, _user: ContextUser) {
    const user = await this.userRepository.findOneByOrFail({ id });
    user.name = userDto.name;
    user.imageUrl = userDto.imageUrl;
    user.description = userDto.description;
    user.socialMedia = userDto.socialMedia;
    await user.save();
    return user;
  }
}
