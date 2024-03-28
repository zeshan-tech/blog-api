import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

const logger = new Logger('main.ts');
const port = process.env.PORT || 8081;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, whitelist: true }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  await app.listen(port, '0.0.0.0');

  logger.log(`Application is listening on port ${port}`);
}
bootstrap();
