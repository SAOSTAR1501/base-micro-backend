import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationType {
  BOOKING_PENDING = 'BOOKING_PENDING',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_IN_PROGRESS = 'BOOKING_IN_PROGRESS',
  COMMENT_CREATE = 'COMMENT_CREATE',
  REGISTER = 'REGISTER',
  VIEW_BIO = 'VIEW_BIO',
  SYSTEM = 'SYSTEM'
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ default: "" })
  userId: string

  @Prop({ required: true, type: Object })
  title: {
    vi: string,
    en: string
  };

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ type: Object, required: true })
  content: {
    vi: string,
    en: string
  };

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isArchieved: boolean;

  @Prop({ type: Object, default: null })
  metadata: Record<string, any>;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Create indexes for common queries
NotificationSchema.index({ customerId: 1, createdAt: -1 });
NotificationSchema.index({ customerId: 1, isRead: 1 });