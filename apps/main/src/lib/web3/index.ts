import { utils, Wallet } from 'ethers';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { TypedData } from '~/main/blockchain/types';

export function generateWallets(mnemonic: string, count: number) {
  const wallets: Wallet[] = [];
  const hdNode = utils.HDNode.fromMnemonic(mnemonic);
  for (let i = 0; i < count; i++) {
    const node = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
    wallets.push(new Wallet(node.privateKey));
  }
  return wallets;
}

export function deadlineIn(seconds: number) {
  return Math.round(new Date().getTime() / 1000) + seconds;
}

export function hashTypedData(typedData: TypedData<any>): string {
  return _TypedDataEncoder.hash(
    typedData.domain,
    typedData.types,
    typedData.value,
  );
}
