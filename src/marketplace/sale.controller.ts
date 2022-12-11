import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/types/response-data';
import { UserRequest } from '~/types/user-request';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleService } from './sale.service';
import { SaleStatus } from './types';

@Controller('sales')
@ApiTags('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchSaleDto: SearchSaleDto,
  ): Promise<ResponseData<SaleEntity[]>> {
    const result = await this.saleService.search(searchSaleDto, {
      status: SaleStatus.ACTIVE,
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
      },
    });
  }

  @Post('')
  @ApiBearerAuth()
  async createSale(
    @Request() request: UserRequest,
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<ResponseData<any>> {
    const result = await this.saleService.createSale(
      createSaleDto,
      {
        userId: request.user.id,
        status: SaleStatus.ACTIVE,
      },
      request.user,
    );
    return formatResponse({ sale: result.sale });
  }
}
