import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MoreThan } from 'typeorm';
import { Public } from '~/main/auth/decorator/public.decorator';
import { ResponseData, formatResponse } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { CheckSaleDto } from './dto/check-sale.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ListNftsDto } from './dto/list-nft.dto';
import { SearchSaleDto } from './dto/search-sale.dto';
import { SignBatchDataDto } from './dto/sign-batch-data.dto';
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
      remainingQuantity: MoreThan(0),
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
      },
    });
  }

  @Post('_search/mine')
  @ApiBearerAuth()
  async searchMine(
    @Request() request: UserRequest,
    @Body() searchSaleDto: SearchSaleDto,
  ): Promise<ResponseData<SaleEntity[]>> {
    const result = await this.saleService.search(searchSaleDto, {
      userId: request.user.id,
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

  @Public()
  @Post('signNftBatch')
  async generateSignBatchData(
    @Request() request: UserRequest,
    @Body() signBatchDataDto: SignBatchDataDto,
  ) {
    const data = await this.saleService.generateSignBatchData(
      signBatchDataDto,
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

  @Public()
  @Post('batch')
  async createBatchSale(
    @Request() request: UserRequest,
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<ResponseData<any>> {
    const entity = await this.saleService.createBatchSale(
      createSaleDto,
      request.user,
    );
    return formatResponse(entity);
  }

  @Public()
  @Post('list/admin')
  async listNftsByAdmin(
    @Body() listNftsDto: ListNftsDto,
  ): Promise<ResponseData<any>> {
    const entity = await this.saleService.listNftsByAdmin(listNftsDto);
    return formatResponse(entity);
  }

  @Post('check/tx_status')
  async checkSaleStatus(
    @Request() request: UserRequest,
    @Body() checkSaleDto: CheckSaleDto,
  ): Promise<ResponseData<any>> {
    const entity = await this.saleService.checkSaleStatus(
      request.user.id,
      checkSaleDto,
    );
    return formatResponse(entity);
  }
}
