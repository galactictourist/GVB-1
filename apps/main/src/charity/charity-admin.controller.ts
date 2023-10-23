import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { Roles } from '~/main/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/main/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/main/auth/guard/roles.guard';
import { formatResponse } from '~/main/types/response-data';
import { AdminRole } from '~/main/user/types';
import { CharityAdminService } from './charity-admin.service';
import { CharityDto } from './dto/charity.dto';
import { CreateCharityTopicAdminDto } from './dto/create-charity-topic-admin.dto';

@Controller('admin/charities')
@Public()
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@Roles(Object.values(AdminRole))
@ApiBearerAuth()
@ApiTags('charity', 'admin', 'admin/charity')
export class CharityAdminController {
  constructor(private readonly charityAdminService: CharityAdminService) {}

  @Get('')
  async getCharityList() {
    const charities = await this.charityAdminService.getCharities();
    return formatResponse(charities.data);
  }

  @Post('')
  async createCharity(@Body() charityDto: CharityDto) {
    const charity = await this.charityAdminService.createCharity(charityDto);
    return formatResponse(charity);
  }

  @Put(':charityId')
  async updateCharity(
    @Param('charityId') charityId: string,
    @Body() charityDto: CharityDto,
  ) {
    const charity = await this.charityAdminService.updateCharity(
      charityId,
      charityDto,
    );
    return formatResponse(charity);
  }

  @Post(':charityId/topics')
  async createCharityTopic(
    @Param('charityId') charityId: string,
    @Body() createCharityTopicAdminDto: CreateCharityTopicAdminDto,
  ) {
    const charity = await this.charityAdminService.createCharityTopic(
      charityId,
      createCharityTopicAdminDto,
    );
    return formatResponse(charity);
  }
}
