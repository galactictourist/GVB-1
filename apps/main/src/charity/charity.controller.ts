import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse } from '~/main/types/response-data';
import { CharityService } from './charity.service';

@Controller('charities')
@ApiTags('charity')
export class CharityController {
  constructor(private readonly charityService: CharityService) {}

  @Public()
  @Get('')
  async getCharityList() {
    const charities = await this.charityService.getActiveCharities();
    return formatResponse(charities.data);
  }

  @Public()
  @Get(':charityId')
  async getCharityDetails(@Param('charityId') charityId: string) {
    const charity = await this.charityService.getCharity(charityId);
    return formatResponse(charity);
  }

  @Public()
  @Get(':charityId/topics')
  async getCharityTopics(@Param('charityId') charityId: string) {
    const topics = await this.charityService.getCharityTopics(charityId);
    return formatResponse(topics.data);
  }
}
