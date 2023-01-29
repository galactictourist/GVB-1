import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '../auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EventFilterDto } from '../shared/dto/event-filter.dto';
import { BlockchainNetwork } from '../types/blockchain';
import { AdminRole } from '../user/types';
import { OrderService } from './order.service';

@Controller('orders')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('order', 'admin', 'admin/order')
export class OrderAdminController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':network/events/complete')
  async processEventComplete(
    @Param('network') network: BlockchainNetwork,
    @Body() eventFilterDto: EventFilterDto,
  ): Promise<any> {
    return this.orderService.processCompletedOrders(
      network,
      eventFilterDto.from,
      eventFilterDto.to,
    );
  }
}
