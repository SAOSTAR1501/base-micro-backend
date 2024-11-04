import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '@app/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
