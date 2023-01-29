import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '../auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EventFilterDto } from '../shared/dto/event-filter.dto';
import { BlockchainNetwork } from '../types/blockchain';
import { AdminRole } from '../user/types';
import { NftService } from './nft.service';

@Controller('sales')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('sale', 'admin', 'admin/sale')
export class NftAdminController {
  constructor(private readonly nftService: NftService) {}

  @Post(':network/events/transfer')
  async processEventTransfer(
    @Param('network') network: BlockchainNetwork,
    @Body() eventFilterDto: EventFilterDto,
  ): Promise<any> {
    return this.nftService.processTransferedNfts(
      network,
      eventFilterDto.from,
      eventFilterDto.to,
    );
  }
}
