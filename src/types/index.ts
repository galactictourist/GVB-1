import { getCodes } from 'country-list';
export interface JwtAuthPayload {
  sub: string;
  wallet: string;
  type: string;
}

const COUNTRY = getCodes();
type A = typeof COUNTRY[number];
const d: A = 'dsfdf';
d.toString();
