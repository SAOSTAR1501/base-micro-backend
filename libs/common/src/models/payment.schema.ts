import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, enum: ['starter', 'pro', 'premium'] })
  planType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['stripe', 'vnpay'] })
  paymentMethod: string;

  @Prop({ required: true, enum: ['completed', 'canceled','past_due'] })
  status: string;

  @Prop({ type: Object })
  stripeDetails: {
    customerId: string;
    subscriptionId: string;
  };

  @Prop({ type: Object })
  vnpayDetails: {
    transactionId: string;
    bankCode: string;
  };

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  canceledAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);