import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, In, MoreThanOrEqual } from 'typeorm';
import { MarketSmartContractService } from '../blockchain/market-smart-contracts.service';
import { OrderCompletedEvent } from '../blockchain/types/event';
import { BlockchainNetwork } from '../types/blockchain';
import { UserService } from '../user/user.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderEntity } from './entity/order.entity';
import { SaleEntity } from './entity/sale.entity';
import { OrderRepository } from './repository/order.repository';
import { SaleRepository } from './repository/sale.repository';
import { OrderStatus, SaleStatus } from './types';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly saleRepository: SaleRepository,
    private readonly userService: UserService,
    private readonly marketSmartContractService: MarketSmartContractService,
  ) {}

  async search(
    searchOrderDto: SearchOrderDto,
    defaults: FindOptionsWhere<OrderEntity>,
  ) {
    const where: FindOptionsWhere<OrderEntity> = {};
    if (
      searchOrderDto.filter?.sellerIds &&
      searchOrderDto.filter.sellerIds.length
    ) {
      where.sellerId = In(searchOrderDto.filter.sellerIds);
    }
    if (
      searchOrderDto.filter?.buyerIds &&
      searchOrderDto.filter.buyerIds.length
    ) {
      where.buyerId = In(searchOrderDto.filter.buyerIds);
    }

    const result = await this.orderRepository.simplePaginate(
      {
        ...where,
        ...defaults,
      },
      searchOrderDto.pagination,
    );
    return result;
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    defaults: DeepPartial<OrderEntity>,
  ) {
    const orderEntity = this.orderRepository.create({
      ...defaults,
    });

    await orderEntity.save();
    return orderEntity;
  }

  async processCompletedOrders(
    network: BlockchainNetwork,
    fromBlock: number,
    toBlock: number,
  ) {
    const events =
      await this.marketSmartContractService.getOrderCompletedEvents(
        network,
        fromBlock,
        toBlock,
      );

    const result = await Promise.allSettled(
      events.map((event) => {
        return this.completeOrder(network, event);
      }),
    );

    return result;
  }

  async completeOrder(
    network: BlockchainNetwork,
    event: OrderCompletedEvent,
  ): Promise<OrderEntity> {
    const saleEntity = await this.saleRepository.findOneByOrFail({
      network,
      hash: event.hash,
    });

    return this._completeOrder(saleEntity, event);
  }

  private async _completeOrder(
    saleEntity: SaleEntity,
    event: OrderCompletedEvent,
    quantity = 1,
  ): Promise<OrderEntity> {
    const transaction = await event.blockchainEvent.getTransactionReceipt();
    const buyer = await this.userService.findOrCreateOneByWallet(
      transaction.from,
    );

    await this.saleRepository.update(
      {
        id: saleEntity.id,
        remainingQuantity: MoreThanOrEqual(quantity),
        status: SaleStatus.LISTING,
      },
      {
        remainingQuantity: () => `remainingQuantity - ${quantity}`,
        status: SaleStatus.FULFILLED,
      },
    );

    // TODO add more fields to order
    const order = this.orderRepository.create({
      sellerId: saleEntity.userId,
      buyerId: buyer.id,
      saleId: saleEntity.id,
      nftId: saleEntity.nftId,
      quantity,
      network: saleEntity.network,
      currency: saleEntity.currency,
      price: saleEntity.price,
      total: saleEntity.calculateTotalAmount(quantity),
      status: OrderStatus.COMPLETED,
      charityId: saleEntity.charityId,
      topicId: saleEntity.topicId,
      countryCode: saleEntity.countryCode,
      charityShare: saleEntity.charityShare,
      charityWallet: saleEntity.charityWallet,
      txId: event.blockchainEvent.transactionHash.toLowerCase(),
    });

    return order;
  }
}
