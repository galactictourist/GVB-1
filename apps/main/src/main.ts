import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { IAppConfig } from './config/app.config';
import { httpConfig as getHttpConfig } from './config/http.config';
import { ISwaggerConfig } from './config/swagger.config';
import { ConfigNamespace } from './types/config';

async function bootstrap() {
  const httpConfig = getHttpConfig();
  const httpsOptions: any = httpConfig.ssl.enabled
    ? { key: httpConfig.ssl.key, cert: httpConfig.ssl.cert }
    : undefined;
  const app = await NestFactory.create(AppModule, { httpsOptions });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<IAppConfig>(ConfigNamespace.APP);

  if (!appConfig.log.enabled) {
    app.useLogger(appConfig.log.enabled);
  }

  app.useGlobalPipes(
    new ValidationPipe({ forbidUnknownValues: true, whitelist: true }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));

  const swaggerConfig = configService.getOrThrow<ISwaggerConfig>(
    ConfigNamespace.SWAGGER,
  );
  const swaggerEnabled = swaggerConfig.enabled;
  const swaggerPath = swaggerConfig.path;
  if (swaggerEnabled) {
    const swaggerTitle = swaggerConfig.title;
    const config = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  app.enableCors({ origin: httpConfig.corsOrigins });
  await app.listen(httpConfig.port, httpConfig.host);

  const schema = httpConfig.ssl.enabled ? 'https' : 'http';
  console.log(`URL: ${schema}://localhost:${httpConfig.port}`);
  if (swaggerEnabled) {
    console.log(
      `Swagger: ${schema}://localhost:${httpConfig.port}/${swaggerPath}`,
    );
  }
}
bootstrap();
