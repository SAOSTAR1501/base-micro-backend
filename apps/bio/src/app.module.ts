import { DatabaseModule, LanguageModule } from '@app/common';
import { Module } from '@nestjs/common';
import { BioModule } from './modules/bio/bio.module';
import { AdminBioModule } from './modules/admin/admin.module';

@Module({
  imports: [
    DatabaseModule,
    LanguageModule,
    BioModule,
    AdminBioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
