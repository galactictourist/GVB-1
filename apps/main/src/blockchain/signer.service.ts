import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bytes, TypedDataDomain, TypedDataField, utils, Wallet } from 'ethers';
import { IBlockchainConfig } from '~/main/config/blockchain.config';
import { BlockchainNetwork, BLOCKCHAIN_INFO } from '~/main/types/blockchain';
import { ConfigNamespace } from '~/main/types/config';
import { AddSingleItem, BuyItem, TypedData } from './types';

@Injectable()
export class SignerService {
  constructor(private readonly configService: ConfigService) {}

  private getSignerWallet() {
    const blockchainConfig = this.configService.getOrThrow<IBlockchainConfig>(
      ConfigNamespace.BLOCKCHAIN,
    );
    const wallet = new Wallet(blockchainConfig.verifier.pk);
    return wallet;
  }

  private async signMarket(
    network: BlockchainNetwork,
    types: Record<string, Array<TypedDataField>>,
    data: Record<string, any>,
  ) {
    const wallet = this.getSignerWallet();

    const domain: TypedDataDomain = {
      name: BLOCKCHAIN_INFO[network].constract.marketplace.name,
      version: '1.0.0',
      chainId: BLOCKCHAIN_INFO[network].chainId,
      verifyingContract: BLOCKCHAIN_INFO[network].constract.marketplace.address,
    };

    // console.log('wallet', wallet.address);
    // console.log('domain', domain);
    // console.log('types', types);
    // console.log('data', data);

    const signature = await wallet._signTypedData(domain, types, data);
    return {
      signature,
      address: wallet.address,
    };
  }

  async signForMinting(network: BlockchainNetwork, data: AddSingleItem) {
    return this.signMarket(
      network,
      {
        AddSingleItem:
          BLOCKCHAIN_INFO[network].constract.marketplace.types?.AddSingleItem ||
          [],
      },
      data,
    );
  }

  async signForBuying(network: BlockchainNetwork, data: BuyItem) {
    return this.signMarket(
      network,
      {
        BuyItem:
          BLOCKCHAIN_INFO[network].constract.marketplace.types?.BuyItem || [],
      },
      data,
    );
  }

  async sign(message: Bytes | string): Promise<string> {
    const wallet = this.getSignerWallet();
    const signature = await wallet.signMessage(message);
    return signature;
  }

  isSignedByVerifier(message: Bytes | string, signature: string): boolean {
    return this.verify(message, signature, this.getSignerWallet().address);
  }

  verify(message: Bytes | string, signature: string, address: string): boolean {
    const signerAddress = utils.verifyMessage(message, signature);
    return signerAddress.toLowerCase() === address.toLowerCase();
  }

  verifyTypedData(
    typedData: TypedData<Record<string, any>>,
    signature: string,
    address: string,
  ): boolean {
    const signerAddress = utils.verifyTypedData(
      typedData.domain,
      typedData.types,
      typedData.value,
      signature,
    );
    return signerAddress.toLowerCase() === address.toLowerCase();
  }
}
