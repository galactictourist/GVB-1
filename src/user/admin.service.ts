import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminEntity } from './entity/admin.entity';
import { AdminRepository } from './repository/admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async validateAdminById(id: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneBy({ id });
    return this._validateAdmin(admin);
  }

  async validateAdmin(
    username: string,
    password: string,
  ): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOneByUsername(username);
    if (admin && !admin.isValidPassword(password)) {
      throw new UnauthorizedException('Password is incorrect');
    }
    return this._validateAdmin(admin);
  }

  private async _validateAdmin(
    admin: AdminEntity | null,
  ): Promise<AdminEntity> {
    if (!admin) {
      throw new UnauthorizedException('Admin is not found');
    }
    if (!admin.isActive()) {
      throw new UnauthorizedException('Admin is not active');
    }
    return admin;
  }
}
