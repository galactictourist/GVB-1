import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { httpConfig } from './http.config';
import { swaggerConfig } from './swagger.config';

export const configs = [appConfig, httpConfig, swaggerConfig, databaseConfig];
