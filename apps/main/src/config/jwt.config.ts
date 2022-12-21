import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { baseDir } from '~/main/base';
import { ConfigNamespace } from '~/main/types/config';

export interface IJwtConfig {
  issuer: string;
  algo: 'RS256';
  expiresIn: string;
  publicKey: string;
  privateKey: string;
  admin: {
    algo: 'RS256';
    expiresIn: string;
    publicKey: string;
    privateKey: string;
  };
}

export const jwtConfig = registerAs(
  ConfigNamespace.JWT,
  (): IJwtConfig => ({
    issuer: 'AuthService',
    algo: 'RS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    publicKey:
      process.env.JWT_PUBLIC_KEY ||
      readFileSync(
        join(baseDir, '/../../../secrets/jwt/jwt-rs256.pub.key'),
        'utf8',
      ),
    privateKey:
      process.env.JWT_PRIVATE_KEY ||
      readFileSync(
        join(baseDir, '/../../../secrets/jwt/jwt-rs256.key'),
        'utf8',
      ),
    admin: {
      algo: 'RS256',
      expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1h',
      publicKey:
        process.env.JWT_ADMIN_PUBLIC_KEY ||
        readFileSync(
          join(baseDir, '/../../../secrets/jwt-admin/jwt-rs256.pub.key'),
          'utf8',
        ),
      privateKey:
        process.env.JWT_ADMIN_PRIVATE_KEY ||
        readFileSync(
          join(baseDir, '/../../../secrets/jwt-admin/jwt-rs256.key'),
          'utf8',
        ),
    },
  }),
);
