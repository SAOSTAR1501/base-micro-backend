import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema, Rate, RateSchema } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Rate.name, schema: RateSchema }
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('CUS_ACCESS_TOKEN_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'BIO_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://user:password@rabbitmq:5672'],
            queue: 'bio_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://user:password@rabbitmq:5672'],
            queue: 'notification_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'SEARCH_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://user:password@rabbitmq:5672'],
            queue: 'search_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}