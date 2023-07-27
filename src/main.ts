import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';


const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });;

  app.setGlobalPrefix('api');

  installSwagger(app, 'Partner Service', 'Description');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT || 3000, () => {
    logger.verbose(`Application listening on port ${process.env.PORT || 3000} in ${process.env.ENV}.`);
  });
}
bootstrap();

function installSwagger(app, title, description, version = '1.0') {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
