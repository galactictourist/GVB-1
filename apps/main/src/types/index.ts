import { getCodes } from 'country-list';
import { JwtPurpose } from '~/auth/types';
export interface JwtAdminAuthPayload {
  purpose: JwtPurpose;
  sub: string;
  wallet: string;
  type: string;
}

export interface JwtAuthPayload {
  sub: string;
  wallet: string;
  type: string;
}

const COUNTRY = getCodes();
type A = typeof COUNTRY[number];
const d: A = 'dsfdf';
d.toString();
