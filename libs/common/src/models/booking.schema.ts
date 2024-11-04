// booking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

interface UserInfo {
  id: string;
  fullname: string;
  username: string;
  avatar: string;
}

interface ServiceInfo {
  id: string;
  name: string;
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Object, required: true })
  customer: UserInfo;

  @Prop({ type: Object, required: true })
  seller: UserInfo;

  @Prop({ type: Object, required: true })
  service: ServiceInfo;

  @Prop({ required: true, type: Date })
  bookingDate: Date;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  })
  status: string;

  @Prop({ type: Object, default: null })
  cancellation: {
    reason: string;
    cancelledBy: string;
    cancelledAt: Date;
  } | null;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: Date })
  confirmedAt: Date;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Date })
  bookingStartTime: Date;

  @Prop({ type: Date })
  bookingEndTime: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Pre-save middleware to combine date and time
BookingSchema.pre('save', function(next) {
  if (this.isModified('bookingDate') || this.isModified('startTime') || this.isModified('endTime')) {
    const [startHour, startMinute] = this.startTime.split(':');
    const [endHour, endMinute] = this.endTime.split(':');

    this.bookingStartTime = new Date(this.bookingDate);
    this.bookingStartTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    this.bookingEndTime = new Date(this.bookingDate);
    this.bookingEndTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
  }
  next();
});

// Indexes
BookingSchema.index({ 'seller.id': 1, bookingDate: 1 });
BookingSchema.index({ 'customer.id': 1, bookingDate: 1 });
BookingSchema.index({ bookingStartTime: 1, bookingEndTime: 1, 'seller.id': 1 });
BookingSchema.index({ status: 1, 'seller.id': 1, bookingDate: 1 });