import { promises as fs } from 'fs';

export async function readFile(path: string) {
  const buffer64 = await fs.readFile(path, { encoding: 'base64' });
  return buffer64;
}

export function randomTokenId() {
  const heads = '123456789';
  const tails = '0123456789';
  const length = 76;
  let randomStr = '';

  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * tails.length);
    randomStr += tails[randomNum];
  }

  return heads[Math.floor(Math.random() * heads.length)] + randomStr; // total length = 77
}
