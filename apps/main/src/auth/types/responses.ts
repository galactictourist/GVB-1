import { ContextAdminInterface } from '~/main/types/admin-request';
import { ContextUserInterface } from '~/main/types/user-request';

export interface SignedInResponse {
  user: ContextUserInterface;
  accessToken: string;
}

export interface AdminSignedInResponse {
  user: ContextAdminInterface;
  accessToken: string;
}

export interface WalletSignResponse {
  signature: string;
}

export interface WalletGenerationResponse {
  address: string;
  privateKey: string;
}

export interface NonceGenerationResponse {
  message: string;
}
