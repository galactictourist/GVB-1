import { Injectable } from '@nestjs/common';
import { TypedDataDomain } from 'ethers';
import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';
import {
  BatchContractData,
  ItemType,
  SaleContractData,
  TypedData,
} from '~/main/blockchain/types';
import { randomUnit256 } from '~/main/lib';
import { BaseRepository } from '~/main/lib/database/base-repository';
import {
  batchTypes,
  getMarketplaceSmartContract,
  getNetworkConfig,
  parseCryptoAmount,
} from '~/main/types/blockchain';
import { SignBatchDataDto } from '../dto/sign-batch-data.dto';
import { SaleEntity } from '../entity/sale.entity';
import { Batch, SaleData } from '../types/sale-data';

@Injectable()
export class SaleRepository extends BaseRepository<SaleEntity> {
  constructor(private dataSource: DataSource) {
    super(SaleEntity, dataSource.createEntityManager());
  }

  generateTypedData(
    sale: SaleEntity,
    salt: string,
    artistAddress: string,
  ): TypedData<SaleContractData> {
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
      !('charityShare' in sale) ||
      !('royalty' in sale.nft) ||
      !('tokenId' in sale.nft)
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
      nftContract: sale.nft.scAddress,
      itemType: ItemType.ERC721,
      seller: sale.user.wallet,
      artist: artistAddress,
      isMinted: sale.nft.isMinted,
      tokenId: String(sale.nft.tokenId),
      tokenURI: sale.nft.getMetadataUrl(),
      quantity: sale.quantity,
      itemPrice: parseCryptoAmount(
        sale.network,
        sale.currency,
        sale.price,
      ).toString(),
      charityAddress: sale.charityWallet,
      charityShare: Number(sale.charityShare),
      royaltyFee: sale.nft.royalty,
      deadline: DateTime.fromJSDate(sale.expiredAt).toUnixInteger(),
      salt,
    };

    const typedData: TypedData<SaleContractData> = {
      types: marketplaceSC.types,
      domain,
      primaryType: 'OrderItem',
      message,
    };

    return typedData;
  }

  generateTypedBatchData(
    signBatchDataDto: SignBatchDataDto,
    batch: SaleEntity[],
    salt: string,
    artistAddress: string,
  ): TypedData<BatchContractData> {
    const marketplaceSC = getMarketplaceSmartContract(batch[0].network);
    console.log({ marketplaceSC: marketplaceSC.types });
    if (!marketplaceSC.types || !marketplaceSC.version) {
      throw new Error('Missing signing domain configuration');
    }

    const domain: TypedDataDomain = {
      name: marketplaceSC.name,
      version: marketplaceSC.version,
      chainId: getNetworkConfig(batch[0].network).chainId,
      verifyingContract: marketplaceSC.address,
    };

    const batchInfo = batch[0];

    const message: BatchContractData = {
      nftContract: batchInfo.nft.scAddress!,
      itemType: ItemType.ERC721,
      seller: batchInfo.user.wallet!,
      artist: artistAddress,
      charityAddress: batchInfo.charityWallet!,
      charityShare: Number(signBatchDataDto.charityShare),
      royaltyFee: batchInfo.nft.royalty,
      deadline: DateTime.fromJSDate(batchInfo.expiredAt!).toUnixInteger(),
      salt,
    };

    const typedData: TypedData<BatchContractData> = {
      types: batchTypes,
      domain,
      primaryType: 'Batch',
      message,
    };

    return typedData;
  }

  generateSaleData(sale: SaleEntity): SaleData {
    if (
      // !sale.countryCode ||
      !sale.topicId ||
      !sale.charityId ||
      !sale.charityShare ||
      !sale.charityWallet ||
      !sale.price ||
      !sale.expiredAt
    ) {
      throw new Error('Cannot generate sale data');
    }

    const salt = randomUnit256();
    const saleData: SaleData = {
      userId: sale.userId,
      nftId: sale.nftId,
      // countryCode: sale.countryCode,
      topicId: sale.topicId,
      charityId: sale.charityId,
      charityShare: sale.charityShare,
      charityWallet: sale.charityWallet,
      network: sale.network,
      currency: sale.currency,
      price: sale.price,
      quantity: sale.quantity,
      expiredAt: DateTime.fromJSDate(sale.expiredAt).toUnixInteger(),
      salt,
    };
    return saleData;
  }

  generateBatchData(
    signBatchDataDto: SignBatchDataDto,
    batch: SaleEntity[],
  ): Batch {
    const salt = randomUnit256();
    const batchData = batch.map((sale) => {
      if (
        !sale.topicId ||
        !sale.charityId ||
        !sale.charityShare ||
        !sale.charityWallet ||
        !sale.price ||
        !sale.expiredAt
      ) {
        throw new Error('Cannot generate sale data');
      }

      return {
        userId: sale.userId,
        nftId: sale.nftId,
        topicId: sale.topicId,
        charityId: sale.charityId,
        charityShare: sale.charityShare,
        charityWallet: sale.charityWallet,
        network: sale.network,
        currency: sale.currency,
        price: sale.price,
        quantity: sale.quantity,
        expiredAt: DateTime.fromJSDate(sale.expiredAt as Date).toUnixInteger(),
      };
    });

    return {
      collectionId: signBatchDataDto.collectionId,
      charityId: signBatchDataDto.charityId,
      charityShare: signBatchDataDto.charityShare,
      nfts: batchData,
      salt,
    };
  }
}
