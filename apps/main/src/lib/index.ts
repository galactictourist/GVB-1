// import axios from 'axios';
import { promises as fs } from 'fs';
import { v4 } from 'uuid';

export async function readFile(path: string) {
  const buffer64 = await fs.readFile(path, { encoding: 'base64' });
  return buffer64;
}

// export async function readFileRemote(url: string) {
//   const response = await axios(url, { responseType: 'arraybuffer' });
//   const buffer64 = Buffer.from(response.data, 'binary').toString('base64');
//   return buffer64;
// }

export function randomUnit256() {
  const heads = '123456789';
  const tails = '0123456789';
  const length = 7;
  let randomStr = '';

  for (let i = 0; i < length; i++) {
    const randomNum = Math.floor(Math.random() * tails.length);
    randomStr += tails[randomNum];
  }

  return heads[Math.floor(Math.random() * heads.length)] + randomStr; // total length = 77
}

export const uuid = v4;
