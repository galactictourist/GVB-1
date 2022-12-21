import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/types/config';

export interface IAppConfig {
  log: {
    enabled: boolean;
  };
}

export const appConfig = registerAs(
  ConfigNamespace.APP,
  (): IAppConfig => ({
    log: {
      enabled:
        process.env.APP_LOG_ENABLED === '1' ||
        process.env.APP_LOG_ENABLED === 'true'
          ? true
          : false,
    },
  }),
);
