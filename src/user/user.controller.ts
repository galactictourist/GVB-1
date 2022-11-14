import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRequest } from '~/types/request';
import { formatResponse, ResponseData } from '~/types/response-data';
import { SignedInUserResponse } from './types/responses';

@Controller('users')
export class UserController {
  @Get('/me')
  @ApiBearerAuth()
  async getMe(
    @Request() req: UserRequest,
  ): Promise<ResponseData<SignedInUserResponse>> {
    return formatResponse({ ...req.user });
  }
}
