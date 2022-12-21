import { Controller, Get } from '@nestjs/common';
import { getName } from 'country-list';
import { Public } from '~/auth/decorator/public.decorator';
import { CountryCode, CountryConfig } from '~/types/country';
import { formatResponse, ResponseData } from '~/types/response-data';

@Controller()
export class CountryController {
  @Public()
  @Get('countries')
  async getCountries(): Promise<ResponseData<CountryConfig[]>> {
    const countries: CountryConfig[] = Object.keys(CountryCode).map(
      (code: keyof typeof CountryCode) =>
        ({
          enabled: true,
          code: CountryCode[code],
          name: getName(code) || code,
        } as CountryConfig),
    );

    return formatResponse(countries);
  }
}
