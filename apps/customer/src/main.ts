import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpExceptionFilter, TransformInterceptor } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
  console.log({ rabbitMqUrl });

  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: 'customer_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  microservice.useGlobalPipes(new ValidationPipe());
  microservice.useGlobalFilters(new HttpExceptionFilter());
  microservice.useGlobalInterceptors(new TransformInterceptor());

  await microservice.listen();
  console.log(`🚀 Customer Microservice is listening`);
}

bootstrap();