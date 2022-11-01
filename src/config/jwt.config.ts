import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigNamespace } from '~/types/config';

export interface IJwtConfig {
  issuer: string;
  algo: 'RS256';
  expiresIn: string;
  publicKey: string;
  privateKey: string;
}

export const jwtConfig = registerAs(
  ConfigNamespace.JWT,
  (): IJwtConfig => ({
    issuer: 'AuthService',
    algo: 'RS256',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    publicKey:
      process.env.JWT_PUBLIC_KEY ||
      readFileSync(join(__dirname, '/../../.jwt-rs256.pub.key'), 'utf8'),
    privateKey:
      process.env.JWT_PRIVATE_KEY ||
      readFileSync(join(__dirname, '/../../.jwt-rs256.key'), 'utf8'),
  }),
);
