import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BioController } from './bio.controller';
import { BioService } from './bio.service';
import { Bio, BioSchema } from './schemes/bio.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Bio.name, schema: BioSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'JOB_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'job_queue',
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
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: 'search_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      }
    ])
  ],
  controllers: [BioController],
  providers: [BioService],
})

export class BioModule { }
