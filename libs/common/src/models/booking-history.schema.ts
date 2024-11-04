import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class BookingHistory extends Document {
  @Prop({ required: true })
  bookingId: string;

  @Prop()
  previousStatus: string;

  @Prop({ required: true })
  newStatus: string;

  @Prop({
    type: {
      id: { type: String, required: true },
      username: { type: String, required: true }, // Thêm vào đây
      fullName: { type: String, required: true }, // Thêm vào đây
      avatarUrl: { type: String, required: true }, // Thêm vào đây
      role: { type: String, enum: ['customer', 'seller'], required: true },
    },
    required: true
  })
  changedBy: {
    id: string;
    username: string; // Thêm vào đây
    fullName: string; // Thêm vào đây
    avatarUrl: string; // Thêm vào đây
    role: string;
  };

  @Prop({ default: null })
  reason: string;
}

export const BookingHistorySchema = SchemaFactory.createForClass(BookingHistory);
BookingHistorySchema.index({ bookingId: 1, createdAt: -1 });
