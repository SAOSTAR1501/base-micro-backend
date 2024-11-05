import { Module } from '@nestjs/common';
import { AdminBioController } from './admin.controller';
import { AdminBioService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bio, BioSchema } from '../bio/schemes/bio.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bio.name, schema: BioSchema }]),
  ],
  controllers: [AdminBioController],
  providers: [AdminBioService]
})
export class AdminBioModule {}
