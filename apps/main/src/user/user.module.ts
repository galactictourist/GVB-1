import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { UserEntity } from './entity/user.entity';
import { AdminRepository } from './repository/admin.repository';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AdminService, UserRepository, AdminRepository],
  controllers: [UserController],
  exports: [UserService, AdminService, UserRepository, AdminRepository],
})
export class UserModule {}
