import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminRepository } from './repository/admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async validateAdmin(username: string, password: string) {
    const admin = await this.adminRepository.findOneByUsername(username);
    if (!admin) {
      throw new UnauthorizedException('Admin is not found');
    }

    if (!admin.isActive()) {
      throw new UnauthorizedException('Admin is not active');
    }

    if (!admin.isValidPassword(password)) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return admin;
  }
}
