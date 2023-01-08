import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MoreThan } from 'typeorm';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SigningSaleDto } from './dto/signing-sale.dto';
import { SaleEntity } from './entity/sale.entity';
import { SaleService } from './sale.service';
import { SaleStatus } from './types';
import { SigningData } from './types/sale-data';

@Controller('sales')
@ApiTags('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchSaleDto: SearchSaleDto,
  ): Promise<ResponseData<SaleEntity[]>> {
    const now = new Date();
    const result = await this.saleService.search(searchSaleDto, {
      status: SaleStatus.LISTING,
      expiredAt: MoreThan(now),
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
      },
    });
  }

  @Post('signing')
  @ApiBearerAuth()
  async generateSigningData(
    @Request() request: UserRequest,
    @Body() signingSaleDto: SigningSaleDto,
  ): Promise<ResponseData<SigningData>> {
    const data = await this.saleService.generateSigningData(
      signingSaleDto,
      request.user,
    );
    return formatResponse(data);
  }

  @Post('')
  @ApiBearerAuth()
  async createSale(
    @Request() request: UserRequest,
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<ResponseData<any>> {
    const entity = await this.saleService.createSale(
      createSaleDto,
      request.user,
    );
    return formatResponse(entity);
  }
}
