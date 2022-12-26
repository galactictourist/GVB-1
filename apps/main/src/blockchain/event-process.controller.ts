import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { EventProcessEntity } from './entity/event-process.entity';
import { EventProcessService } from './event-process.service';

@Controller('event-process')
@ApiTags('event-process')
export class EventProcessController {
  constructor(private readonly eventProcessService: EventProcessService) {}

  @Public()
  @Get('')
  async getAll(): Promise<ResponseData<EventProcessEntity[]>> {
    const result = await this.eventProcessService.getActiveEntities();
    return formatResponse(result);
  }
}
