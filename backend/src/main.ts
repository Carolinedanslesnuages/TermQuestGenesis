import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors();

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TermQuest Genesis API')
    .setDescription('The TermQuest Genesis API documentation')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('TermQuest Genesis API is running on http://localhost:3000');
  console.log('API Documentation is available at http://localhost:3000/api');
}
bootstrap();
