import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseData, formatResponse } from '~/main/types/response-data';
import { UserRequest } from '~/main/types/user-request';
import { Public } from '../auth/decorator/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignedInUserResponse } from './types/responses';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth()
  async getMe(
    @Request() req: UserRequest,
  ): Promise<ResponseData<SignedInUserResponse>> {
    console.log(req);
    return formatResponse({ ...req.user });
  }

  @Public()
  @Get(':userId')
  async getUserProfile(@Param('userId') userId: string) {
    const user = await this.userService.findById(userId);
    return formatResponse(user);
  }

  @Public()
  @Put(':id')
  @ApiBearerAuth()
  async updateCollection(
    @Param('id') userId: string,
    @Request() request: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseData<any>> {
    const collection = await this.userService.updateUser(
      userId,
      updateUserDto,
      request.user,
    );
    return formatResponse(collection);
  }
}
