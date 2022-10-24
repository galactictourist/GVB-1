import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { IAppConfig } from './config/app.config';
import { IHttpConfig } from './config/http.config';
import { ISwaggerConfig } from './config/swagger.config';
import { ConfigNamespace } from './types/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<IAppConfig>(ConfigNamespace.APP);

  if (!appConfig.log.enabled) {
    app.useLogger(appConfig.log.enabled);
  }

  const swaggerConfig = configService.getOrThrow<ISwaggerConfig>(
    ConfigNamespace.SWAGGER,
  );

  const swaggerEnabled = swaggerConfig.enabled;
  if (swaggerEnabled) {
    const swaggerPath = swaggerConfig.path;
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
  await app.listen(httpConfig.port, httpConfig.host);
  console.log('URL: http://localhost:' + httpConfig.port);
}
bootstrap();
