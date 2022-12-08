import { utils, Wallet } from 'ethers';

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
