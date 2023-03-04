import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConflictExceptionFilter } from './lib/multi-language/conflic-exception.filter';
import {
  InputValidationExceptionFactory,
  InputValidationExceptionFilter,
} from './lib/multi-language/input-validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: InputValidationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new InputValidationExceptionFilter(), new ConflictExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('BPM NESTJS USER API')
    .setDescription('Description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port = app.get<ConfigService>(ConfigService).get('app.port');
  await app.listen(port, () => console.log(`listennig to port ${port} ...`));
}
bootstrap();
