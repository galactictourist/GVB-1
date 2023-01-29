import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '../auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EventFilterDto } from '../shared/dto/event-filter.dto';
import { BlockchainNetwork } from '../types/blockchain';
import { AdminRole } from '../user/types';
import { SaleService } from './sale.service';

@Controller('sales')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('sale', 'admin', 'admin/sale')
export class SaleAdminController {
  constructor(private readonly saleService: SaleService) {}

  @Post(':network/events/cancel')
  async processEventCancel(
    @Param('network') network: BlockchainNetwork,
    @Body() eventFilterDto: EventFilterDto,
  ): Promise<any> {
    return this.saleService.processCancelledSales(
      network,
      eventFilterDto.from,
      eventFilterDto.to,
    );
  }
}
