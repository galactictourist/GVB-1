import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthedRequest } from '~/types/request';
import { ResponseData } from '~/types/response-data';

@Controller('user')
export class UserController {
  @Get('/me')
  @ApiBearerAuth()
  async getMe(@Request() req: AuthedRequest): Promise<ResponseData<any>> {
    return { data: { user: req.user } };
  }
}
