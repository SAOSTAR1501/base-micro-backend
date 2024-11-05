import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter, TransformInterceptor } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rabbitMQUrl = configService.get<string>('RABBITMQ_URL');

  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: 'bio_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  microserviceApp.useGlobalFilters(new HttpExceptionFilter());
  microserviceApp.useGlobalInterceptors(new TransformInterceptor());

  await microserviceApp.listen();
  console.log('🚀 Bio Microservice is listening');
}
bootstrap();
