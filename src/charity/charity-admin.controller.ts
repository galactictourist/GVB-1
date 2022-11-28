import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '~/auth/decorator/public.decorator';
import { Roles } from '~/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/auth/guard/roles.guard';
import { formatResponse } from '~/types/response-data';
import { AdminRole } from '~/user/types';
import { CharityAdminService } from './charity-admin.service';
import { CreateCharityAdminDto } from './dto/create-charity-admin.dto';
import { UpdateCharityAdminDto } from './dto/update-charity-admin.dto';

@Controller('admin/charities')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
export class CharityAdminController {
  constructor(private readonly charityAdminService: CharityAdminService) {}

  @Post('')
  async createCharity(@Body() createCharityAdminDto: CreateCharityAdminDto) {
    const charity = await this.charityAdminService.createCharity(
      createCharityAdminDto,
    );
    return formatResponse(charity);
  }

  @Put(':charityId')
  async updateCharity(
    @Param('charityId') charityId: string,
    @Body() updateCharityAdminDto: UpdateCharityAdminDto,
  ) {
    const charity = await this.charityAdminService.updateCharity(
      charityId,
      updateCharityAdminDto,
    );
    return formatResponse(charity);
  }
}
