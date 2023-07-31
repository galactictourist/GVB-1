import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { EventProcessService } from '~/main/blockchain/event-process.service';
import { MarketSmartContractService } from '~/main/blockchain/market-smart-contracts.service';
import { ContractStandard } from '~/main/blockchain/types';
import { IBlockchainConfig } from '~/main/config/blockchain.config';
import { OrderService } from '~/main/marketplace/order.service';
import { SaleService } from '~/main/marketplace/sale.service';
import { NftService } from '~/main/nft/nft.service';
import {
  BlockchainNetwork,
  getEnabledBlockchainNetworks,
  getMarketplaceSmartContract,
} from '~/main/types/blockchain';
import { ConfigNamespace } from '~/main/types/config';

@Injectable()
export class CronService {
  MAX_BLOCK = 1000;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly eventProcessService: EventProcessService,
    private readonly marketSmartContractService: MarketSmartContractService,
    private readonly orderService: OrderService,
    private readonly saleService: SaleService,
    private readonly nftService: NftService,
    private readonly configService: ConfigService,
  ) {
    const blockchainConfig = this.configService.getOrThrow<IBlockchainConfig>(
      ConfigNamespace.BLOCKCHAIN,
    );
    this.MAX_BLOCK = blockchainConfig.eventFetchingMaxBlock;
  }

  // @Cron('*/15 * * * * *', { name: 'processEvents' })
  // async processEvents() {
  //   console.log('Running at', new Date());
  //   const job = this.schedulerRegistry.getCronJob('processEvents');
  //   console.log('last date', job.lastDate());
  //   const activeEvents = await this.eventProcessService.getActiveEntities();
  //   console.log('activeEvents', activeEvents);

  //   const blocks = 500;
  //   const networks = getEnabledBlockchainNetworks();
  //   const result = Promise.allSettled(
  //     Object.keys(networks)
  //       .map(async (network: keyof typeof BlockchainNetwork) => {
  //         const blockNumber =
  //           await this.marketSmartContractService.getCurrentBlockNumber(
  //             BlockchainNetwork[network],
  //           );
  //         return [
  //           this.nftService.processTransferedNfts(
  //             BlockchainNetwork[network],
  //             blockNumber - blocks,
  //             blockNumber,
  //           ),
  //           this.saleService.processCancelledSales(
  //             BlockchainNetwork[network],
  //             blockNumber - blocks,
  //             blockNumber,
  //           ),
  //           this.orderService.processCompletedOrders(
  //             BlockchainNetwork[network],
  //             blockNumber - blocks,
  //             blockNumber,
  //           ),
  //         ];
  //       })
  //       .flat(),
  //   );

  //   return result;
  // }

  // @Cron('*/15 * * * * *', { name: 'processTransferedNfts' })
  // async processTransferedNfts() {
  //   console.log('processTransferedNfts: Running at', new Date());
  //   const job = this.schedulerRegistry.getCronJob('processTransferedNfts');
  //   console.log('last date', job.lastDate());

  //   const eventName = 'Transfer';
  //   const networks = getEnabledBlockchainNetworks();
  //   const result = Promise.allSettled(
  //     Object.keys(networks).map(
  //       async (network: keyof typeof BlockchainNetwork) => {
  //         try {
  //           const scAddress = getErc721SmartContract(
  //             BlockchainNetwork[network],
  //           ).address;
  //           const eventProcess = await this.eventProcessService.getEventProcess(
  //             BlockchainNetwork[network],
  //             scAddress,
  //             eventName,
  //             ContractStandard.ERC721,
  //           );
  //           if (eventProcess && eventProcess.isActive()) {
  //             const blockNumber =
  //               await this.marketSmartContractService.getCurrentBlockNumber(
  //                 BlockchainNetwork[network],
  //               );
  //             const startBlockNumber =
  //               eventProcess.endBlockNumber ||
  //               eventProcess.beginBlockNumber ||
  //               blockNumber - 1;
  //             const endBlockNumber = Math.min(
  //               startBlockNumber + this.MAX_BLOCK,
  //               blockNumber,
  //             );
  //             const result = await this.nftService.processTransferedNfts(
  //               BlockchainNetwork[network],
  //               startBlockNumber + 1,
  //               endBlockNumber,
  //             );
  //             await this.eventProcessService.updateEventProcess(
  //               eventProcess.id,
  //               eventProcess.endBlockNumber,
  //               endBlockNumber,
  //             );
  //             return result;
  //           }
  //         } catch (e: unknown) {
  //           console.error('Error', e);
  //           throw e;
  //         }
  //       },
  //     ),
  //   );

  //   return result;
  // }

  @Cron('*/15 * * * * *', { name: 'processCancelledSales' })
  async processCancelledSales() {
    console.log('processCancelledSales: Running at', new Date());
    const job = this.schedulerRegistry.getCronJob('processCancelledSales');
    console.log('last date', job.lastDate());

    const eventName = 'CancelledSales';
    const networks = getEnabledBlockchainNetworks();
    const result = Promise.allSettled(
      Object.keys(networks).map(
        async (network: keyof typeof BlockchainNetwork) => {
          try {
            const scAddress = getMarketplaceSmartContract(
              BlockchainNetwork[network],
            ).address;
            console.log('address', scAddress);
            // const eventProcess = await this.eventProcessService.getEventProcess(
            //   BlockchainNetwork[network],
            //   scAddress,
            //   eventName,
            //   ContractStandard.GAB_MARKETPLACE_V1,
            // );
            // console.log(eventProcess);
            // if (eventProcess && eventProcess.isActive()) {
            const blockNumber =
              await this.marketSmartContractService.getCurrentBlockNumber(
                BlockchainNetwork[network],
              );
            const startBlockNumber =
              // eventProcess.endBlockNumber ||
              // eventProcess.beginBlockNumber ||
              blockNumber - 1;
            const endBlockNumber = Math.min(
              startBlockNumber + this.MAX_BLOCK,
              blockNumber,
            );
            const result = await this.saleService.processCancelledSales(
              BlockchainNetwork[network],
              startBlockNumber + 1,
              endBlockNumber,
            );
            console.log(result, blockNumber, startBlockNumber, endBlockNumber);
            // await this.eventProcessService.updateEventProcess(
            //   eventProcess.id,
            //   eventProcess.endBlockNumber,
            //   endBlockNumber,
            // );
            return result;
            // }
          } catch (e: unknown) {
            console.error('Error', e);
            throw e;
          }
        },
      ),
    );

    return result;
  }

  @Cron('*/15 * * * * *', { name: 'processCompletedOrders' })
  async processCompletedOrders() {
    console.log('processCompletedOrders: Running at', new Date());
    const job = this.schedulerRegistry.getCronJob('processCompletedOrders');
    console.log('last date', job.lastDate());

    const eventName = 'CompletedOrders';
    const networks = getEnabledBlockchainNetworks();
    const result = Promise.allSettled(
      Object.keys(networks).map(
        async (network: keyof typeof BlockchainNetwork) => {
          try {
            const scAddress = getMarketplaceSmartContract(
              BlockchainNetwork[network],
            ).address;
            const eventProcess = await this.eventProcessService.getEventProcess(
              BlockchainNetwork[network],
              scAddress,
              eventName,
              ContractStandard.GAB_MARKETPLACE_V1,
            );
            if (eventProcess && eventProcess.isActive()) {
              const blockNumber =
                await this.marketSmartContractService.getCurrentBlockNumber(
                  BlockchainNetwork[network],
                );
              const startBlockNumber =
                eventProcess.endBlockNumber ||
                eventProcess.beginBlockNumber ||
                blockNumber - 1;
              const endBlockNumber = Math.min(
                startBlockNumber + this.MAX_BLOCK,
                blockNumber,
              );
              const result = await this.orderService.processCompletedOrders(
                BlockchainNetwork[network],
                startBlockNumber + 1,
                endBlockNumber,
              );
              await this.eventProcessService.updateEventProcess(
                eventProcess.id,
                eventProcess.endBlockNumber,
                endBlockNumber,
              );
              return result;
            }
          } catch (e: unknown) {
            console.error('Error', e);
            throw e;
          }
        },
      ),
    );

    return result;
  }
}
