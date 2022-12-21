import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './order.service';
import { OrderStatus } from './types';

@Controller('orders')
@ApiTags('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @ApiBearerAuth()
  async createOrder(
    @Request() request: UserRequest,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseData<OrderEntity>> {
    const order = await this.orderService.createOrder(createOrderDto, {
      buyerId: request.user.id,
      status: OrderStatus.PLACED,
    });
    return formatResponse(order);
  }
}
