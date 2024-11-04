import {
  LoggerModule,
  ValidationExceptionFilter
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';
import { FrontendModule } from './modules/frontend/frontend.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    LoggerModule,
    AdminModule,
    FrontendModule,
  ],
  controllers: [
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
  ],
})
export class GatewayModule {}
