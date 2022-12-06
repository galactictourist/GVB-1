import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { SaleEntity } from './entity/sale.entity';
import { MarketplaceService } from './marketplace.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './repository/order.repository';
import { SaleRepository } from './repository/sale.repository';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';

@Module({
  imports: [TypeOrmModule.forFeature([SaleEntity, OrderEntity])],
  controllers: [SaleController, OrderController],
  providers: [MarketplaceService, OrderRepository, SaleRepository, SaleService],
})
export class MarketplaceModule {}
