import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('main.ts');
const port = process.env.PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  app.enableCors();

  await app.listen(port, '0.0.0.0');

  logger.log(`Application is listening on port ${port}`);
  logger.log(
    `Graphiql playground is available at http://127.0.0.1:${port}/graphql`,
  );
}
bootstrap();
