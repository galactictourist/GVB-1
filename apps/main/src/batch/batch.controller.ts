import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse } from '~/main/types/response-data';
import { BatchService } from './batch.service';

@Controller('batches')
@ApiTags('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Public()
  @Get(':id')
  async getBatchList(@Param('id') collectionId: string) {
    const batches = await this.batchService.getBatchList(collectionId);
    return formatResponse(batches);
  }
}
