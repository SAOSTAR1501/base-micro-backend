import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Đảm bảo bạn import đúng schema Customer
import { Customer } from './customer.schema';
@Schema({ timestamps: true })
export class Follower extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Customer.name })
  userId: Types.ObjectId; // ID của người dùng có followers và following

  @Prop({ type: [{ type: Types.ObjectId, ref: Customer.name }], default: [] })
  followers: Types.ObjectId[]; // Mảng ID của những người theo dõi

  @Prop({ type: [{ type: Types.ObjectId, ref: Customer.name }], default: [] })
  following: Types.ObjectId[]; // Mảng ID của những người được theo dõi
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
