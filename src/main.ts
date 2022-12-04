import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import http from 'http';
import https from 'https';
import { AppModule } from './app.module';
import { IAppConfig } from './config/app.config';
import { IHttpConfig } from './config/http.config';
import { ISwaggerConfig } from './config/swagger.config';
import { ConfigNamespace } from './types/config';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<IAppConfig>(ConfigNamespace.APP);

  if (!appConfig.log.enabled) {
    app.useLogger(appConfig.log.enabled);
  }

  app.useGlobalPipes(
    new ValidationPipe({ forbidUnknownValues: true, whitelist: true }),
  );

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
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }

  const httpConfig = configService.getOrThrow<IHttpConfig>(
    ConfigNamespace.HTTP,
  );
  app.enableCors({ origin: httpConfig.corsOrigins });

  if (httpConfig.https.enabled) {
    https
      .createServer(
        {
          key: httpConfig.https.key,
          cert: httpConfig.https.cert,
        },
        server,
      )
      .listen(httpConfig.port, httpConfig.host);
  } else {
    http.createServer(server).listen(httpConfig.port, httpConfig.host);
  }

  console.log(`URL: http://localhost:${httpConfig.port}`);
  if (swaggerEnabled) {
    console.log(`Swagger: http://localhost:${httpConfig.port}/${swaggerPath}`);
  }
}
bootstrap();
