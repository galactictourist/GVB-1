import { Module } from '@nestjs/common';
import { NftModule } from '~/main/nft/nft.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { CharityModule } from '../charity/charity.module';
import { UserModule } from '../user/user.module';
import { MarketplaceService } from './marketplace.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './repository/order.repository';
import { SaleRepository } from './repository/sale.repository';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
  imports: [NftModule, BlockchainModule, CharityModule, UserModule],
  controllers: [SaleController, OrderController],
  providers: [
    MarketplaceService,
    OrderRepository,
    SaleRepository,
    SaleService,
    OrderService,
  ],
})
export class MarketplaceModule {}
