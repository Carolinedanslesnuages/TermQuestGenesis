import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TermQuestGenesis API')
    .setDescription('API for managing users and quests in TermQuestGenesis')
    .setVersion('1.0')
    .addTag('users', 'User management operations')
    .addTag('quests', 'Quest management operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🚀 Backend server is running on http://localhost:3000');
  console.log('📖 API documentation available at http://localhost:3000/api');
}

bootstrap();