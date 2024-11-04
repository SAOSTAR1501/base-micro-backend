import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);

@Schema({ timestamps: true })
export class Price extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Number })
  minPrice: number;

  @Prop({ required: true, type: Number })
  maxPrice: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);

export class CustomerType {
  customerId: string;
  fullname: string;
  username: string;
  avatarUrl: string;
}

@Schema({ timestamps: true })
export class CustomerJob extends Document {
  @Prop({
    type: {
      sellerId: { type: String, required: true },
      fullname: { type: String, required: true },
      username: { type: String, required: true },
      avatarUrl: { type: String, required: true }
    },
    required: true
  })
  seller: CustomerType;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Job' }], default: [] })
  jobIds: MongooseSchema.Types.ObjectId[];
}

export const CustomerJobSchema = SchemaFactory.createForClass(CustomerJob);

