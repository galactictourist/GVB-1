import { registerAs } from '@nestjs/config';
import { ConfigNamespace } from '~/main/types/config';

export interface IAppConfig {
  log: {
    enabled: boolean;
  };
  maxFileUploadSize: number;
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
    maxFileUploadSize:
      (process.env.APP_MAX_FILE_UPLOAD_SIZE_MB
        ? +process.env.APP_MAX_FILE_UPLOAD_SIZE_MB
        : 2) *
      1024 *
      1024,
  }),
);
