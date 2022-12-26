import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminRepository } from './repository/admin.repository';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [UserService, AdminService, UserRepository, AdminRepository],
  controllers: [UserController],
  exports: [UserService, AdminService, UserRepository, AdminRepository],
})
export class UserModule {}
