import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema, Follower, FollowerSchema } from '@app/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Customer.name, schema: CustomerSchema },
            { name: Follower.name, schema: FollowerSchema }
        ]),
    ],
    controllers: [FollowController],
    providers: [FollowService]
})
export class FollowModule { }
