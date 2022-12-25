import { Injectable } from '@nestjs/common';
import { TypedDataDomain } from 'ethers';
import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';
import { SaleContractData, TypedData } from '~/main/blockchain/types';
import { randomTokenId } from '~/main/lib';
import { BaseRepository } from '~/main/lib/database/base-repository';
import {
  getMarketplaceSmartContract,
  getNetworkConfig,
  parseCryptoAmount,
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
    // validate sale
    if (
      !sale.user.wallet ||
      !sale.nft.scAddress ||
      !sale.expiredAt ||
      !sale.charityWallet ||
      !sale.charityShare ||
      !sale.nft.royalty ||
      !sale.nft.tokenId
    ) {
      throw new Error('Invalid sale information');
    }

    const domain: TypedDataDomain = {
      name: marketplaceSC.name,
      version: marketplaceSC.version,
      chainId: getNetworkConfig(sale.network).chainId,
      verifyingContract: marketplaceSC.address,
    };

    const message: SaleContractData = {
      seller: sale.user.wallet,
      nftContract: sale.nft.scAddress,
      isMinted: sale.nft.isMinted(),
      tokenId: sale.nft.tokenId,
      tokenURI: sale.nft.getMetadataUrl(),
      quantity: sale.quantity,
      itemPrice: parseCryptoAmount(sale.network, sale.currency, sale.price), // listed price
      additionalPrice: 0, // additional price for charity
      charityAddress: sale.charityWallet,
      charityFee: sale.charityShare,
      royaltyFee: sale.nft.royalty,
      deadline: DateTime.fromJSDate(sale.expiredAt).toSeconds(), // expiry time of listed NFT
    };

    const typedData = {
      types: marketplaceSC.types,
      domain,
      value: message,
    };

    return typedData;
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
