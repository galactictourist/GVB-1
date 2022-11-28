import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AdminRequest } from '~/types/admin-request';
import { formatResponse, ResponseData } from '~/types/response-data';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import { AdminSigninDto } from './dto/admin-signin.dto';
import { LocalAdminAuthGuard } from './guard/local-admin-auth.guard';
import { AdminSignedInResponse } from './types/responses';

@Controller('admin/auth')
export class AuthAdminController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: AdminSigninDto })
  @UseGuards(LocalAdminAuthGuard)
  @Post('/signin')
  async adminSignin(
    @Body() adminSigninDto: AdminSigninDto,
    @Request() req: AdminRequest,
  ): Promise<ResponseData<AdminSignedInResponse>> {
    const result = await this.authService.adminSignIn(req.user);
    return formatResponse(result);
  }
}
