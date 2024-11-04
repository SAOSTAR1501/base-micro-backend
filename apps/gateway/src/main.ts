declare const module: any;

import { QUEUES, RpcExceptionInterceptor } from '@app/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { raw } from 'body-parser';
import { Logger } from 'nestjs-pino';
import { GatewayModule } from './gateway.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT')
  const rabbitMQUrl = configService.get<string>('RABBITMQ_URL');
  const FRONT_END_URL = configService.get<string>('FRONT_END_URL');

  app.use('/frontend-api/payment/webhook-stripe', raw({ type: 'application/json' }));
  app.enableCors({
    // origin: "*",
    // allowedHeaders:"*",
    origin: [FRONT_END_URL, 'http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning', 'Access-Control-Allow-Credentials'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true,
      exceptionFactory: (errors) => {
        const errorMessages = errors.map(err => ({
          field: err.property,
          constraints: err.constraints,
        }));
        return new BadRequestException(errorMessages);
      },
    }),
  );
  app.useGlobalInterceptors(new RpcExceptionInterceptor());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMQUrl],
      queue: QUEUES.API_GATEWAY_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  setupSwagger(app);
  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`🚀 API Gateway is running on port: ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
