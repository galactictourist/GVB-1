import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IJwtConfig } from '~/config/jwt.config';
import { ConfigNamespace } from '~/types/config';
import { UserModule } from '~/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { NonceEntity } from './entity/nonce.entity';
import { NonceRepository } from './repository/nonce.repository';
import { SignatureVerifierService } from './signature-verifier.service';
import { JwtAdminStrategy } from './strategy/jwt-admin.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalAdminStrategy } from './strategy/local-admin.strategy';
import { Web3Strategy } from './strategy/web3.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwtConfig = configService.getOrThrow<IJwtConfig>(
          ConfigNamespace.JWT,
        );
        const options: JwtModuleOptions = {
          publicKey: jwtConfig.publicKey,
          privateKey: jwtConfig.privateKey,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.issuer,
            algorithm: jwtConfig.algo,
          },
        };
        return options;
      },
    }),
    PassportModule,
    TypeOrmModule.forFeature([NonceEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    NonceRepository,
    Web3Strategy,
    JwtStrategy,
    JwtAdminStrategy,
    LocalAdminStrategy,
    SignatureVerifierService,
  ],
  exports: [NonceRepository],
})
export class AuthModule {}
