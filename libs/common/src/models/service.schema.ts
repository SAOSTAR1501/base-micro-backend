import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Seller } from "../interface";
import { CustomerType } from "./job.schema";

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ type: CustomerType, required: true })
  seller: Seller;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  duration: number; // in minutes

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
