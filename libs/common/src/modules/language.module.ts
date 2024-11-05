import { Module } from '@nestjs/common';
import {
    CookieResolver,
    HeaderResolver,
    I18nModule,
    QueryResolver
} from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['lang']),
        new CookieResolver(),
      ],
    }),
  ],
})
export class LanguageModule {}