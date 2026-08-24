import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove data not in the dto
      transform: true, // transform the data to the dto type
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
