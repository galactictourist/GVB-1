import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { formatResponse, ResponseData } from '~/types/response-data';
import { UserRequest } from '~/types/user-request';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleService } from './sale.service';
import { SaleStatus } from './types';

@Controller('marketplace/sales')
@ApiTags('marketplace')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post('')
  @ApiBearerAuth()
  async createSale(
    @Request() request: UserRequest,
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<ResponseData<SaleEntity>> {
    const sale = await this.saleService.createSale(createSaleDto, {
      userId: request.user.id,
      status: SaleStatus.ACTIVE,
    });
    return formatResponse(sale);
  }
}
