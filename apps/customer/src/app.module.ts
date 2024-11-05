import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from "./modules/customer/auth.module";
import { CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AdminModule } from './modules/admin/admin.module';
import * as path from 'path';
import { FollowModule } from './modules/follow/follow.module';
import { DatabaseModule, LanguageModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    LanguageModule,
    AuthModule,
    AdminModule,
    FollowModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}