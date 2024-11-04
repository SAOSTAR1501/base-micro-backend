import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WorkingHours extends Document {
  @Prop({ required: true })
  sellerId: string;

  @Prop({
    type: [{
      dayOfWeek: { 
        type: String, 
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
      },
      isAvailable: { type: Boolean, default: true },
      slots: [{
        startTime: String,
        endTime: String,
      }]
    }]
  })
  schedule: Array<{
    dayOfWeek: string;
    isAvailable: boolean;
    slots: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>;

  @Prop({ type: [Date], default: [] })
  unavailableDates: Date[];
}

export const WorkingHoursSchema = SchemaFactory.createForClass(WorkingHours);
WorkingHoursSchema.index({ sellerId: 1 });