import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { Public } from '../auth/decorator/public.decorator';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './order.service';
import { OrderStatus } from './types';

@Controller('orders')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Public()
  @Post('_search')
  async search(
    @Body() searchOrderDto: SearchOrderDto,
  ): Promise<ResponseData<OrderEntity[]>> {
    const result = await this.orderService.search(searchOrderDto, {
      status: OrderStatus.COMPLETED,
    });
    return formatResponse(result.data, {
      pagination: {
        total: result.total,
        limit: result.limit,
        page: result.page,
      },
    });
  }
}
