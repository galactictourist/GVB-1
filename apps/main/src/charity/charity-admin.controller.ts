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
import { Public } from '~/auth/decorator/public.decorator';
import { Roles } from '~/auth/decorator/roles.decorator';
import { JwtAdminAuthGuard } from '~/auth/guard/jwt-admin-auth.guard';
import { RolesGuard } from '~/auth/guard/roles.guard';
import { formatResponse } from '~/types/response-data';
import { AdminRole } from '~/user/types';
import { CharityAdminService } from './charity-admin.service';
import { CreateCharityAdminDto } from './dto/create-charity-admin.dto';
import { CreateCharityTopicAdminDto } from './dto/create-charity-topic-admin.dto';
import { UpdateCharityAdminDto } from './dto/update-charity-admin.dto';

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
