import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  bioId: string;

  @Prop({ required: true })
  createdById: string;

  @Prop({ type: Number })
  rating: number;

  @Prop({ type: String, required: true })
  comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
