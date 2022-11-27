import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { formatResponse, ResponseData } from '~/types/response-data';
import { UserRequest } from '~/types/user-request';
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
