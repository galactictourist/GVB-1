import { ContextUserInterface } from '~/types/request';

export interface SignedInResponse {
  user: ContextUserInterface;
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
