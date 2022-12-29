import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '~/main/auth/decorator/public.decorator';
import { formatResponse, ResponseData } from '~/main/types/response-data';
import { getEnabledBlockchainNetworks } from '../types/blockchain';

@Controller('blockchains')
@ApiTags('blockchain')
export class BlockchainController {
  @Public()
  @Get('')
  async getList(): Promise<ResponseData<string[]>> {
    const activeNetworks = getEnabledBlockchainNetworks();
    return formatResponse(Object.keys(activeNetworks));
  }
}
