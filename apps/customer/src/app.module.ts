import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from "./modules/customer/auth.module";
import { CookieResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AdminModule } from './modules/admin/admin.module';
import * as path from 'path';
import { FollowModule } from './modules/follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'vi',
      loaderOptions: {
        path: path.join(__dirname, '../src/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', "l"] },
        new HeaderResolver(['lang']),
        new CookieResolver(),
      ],
    }),
    AuthModule,
    AdminModule,
    FollowModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}