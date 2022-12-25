import { Injectable } from '@nestjs/common';
import { TypedDataDomain } from 'ethers';
import { DataSource } from 'typeorm';
import { SaleContractData, TypedData } from '~/main/blockchain/types';
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

  generateTypedData(sale: SaleEntity): TypedData<SaleContractData> {
    const marketplaceSC = getMarketplaceSmartContract(sale.network);
    if (!marketplaceSC.types || !marketplaceSC.version) {
      throw new Error('Missing signing domain configuration');
    }

    const domain: TypedDataDomain = {
      name: marketplaceSC.name,
      version: marketplaceSC.version,
      chainId: getNetworkConfig(sale.network).chainId,
      verifyingContract: marketplaceSC.address,
    };

    const message: SaleContractData = {
      seller: sale.user.wallet || '',
    };

    const signData = {
      types: marketplaceSC.types,
      domain,
      value: message,
    };

    return signData;
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
