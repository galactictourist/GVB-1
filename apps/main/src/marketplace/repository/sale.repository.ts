import { Injectable } from '@nestjs/common';
import { TypedData } from 'eip-712';
import { DataSource } from 'typeorm';
import { randomTokenId } from '~/main/lib';
import { BaseRepository } from '~/main/lib/database/base-repository';
import {
  getMarketplaceSmartContract,
  getNetworkConfig,
} from '~/main/types/blockchain';
import { SaleEntity } from '../entity/sale.entity';
import { SaleData } from '../types/sale-data';

@Injectable()
export class SaleRepository extends BaseRepository<SaleEntity> {
  constructor(private dataSource: DataSource) {
    super(SaleEntity, dataSource.createEntityManager());
  }

  generateSignDataSale(sale: SaleEntity): TypedData {
    const salt = randomTokenId();
    const marketplaceSC = getMarketplaceSmartContract(sale.network);
    if (!marketplaceSC.types || !marketplaceSC.version) {
      throw new Error('Missing signing domain configuration');
    }

    const message: Record<string, any> = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    };

    const signData = {
      types: marketplaceSC.types || {},
      primaryType: 'Mail',
      domain: {
        name: marketplaceSC.name,
        version: marketplaceSC.version,
        chainId: getNetworkConfig(sale.network).chainId,
        verifyingContract: marketplaceSC.address,
      },
      message,
    };

    return signData;
    // const msg = getMessage(
    //   ,
    //   true,
    // );

    // return '0x' + bytesToHex(msg).toLowerCase();
  }

  generateSaleData(sale: SaleEntity): SaleData {
    if (
      !sale.countryCode ||
      !sale.topicId ||
      !sale.charityId ||
      !sale.charityShare ||
      !sale.charityWallet ||
      !sale.price ||
      !sale.expiredAt
    ) {
      throw new Error('Cannot generate sale data');
    }

    const salt = randomTokenId();
    const saleData: SaleData = {
      userId: sale.userId,
      nftId: sale.nftId,
      countryCode: sale.countryCode,
      topicId: sale.topicId,
      charityId: sale.charityId,
      charityShare: sale.charityShare,
      charityWallet: sale.charityWallet,
      network: sale.network,
      currency: sale.currency,
      price: sale.price,
      expiredAt: Math.floor(sale.expiredAt.getTime() / 1000),
      salt,
    };
    return saleData;
  }
}
