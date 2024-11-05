import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BioDocument = Bio & Document;

@Schema({ timestamps: true })
export class Bio extends Document {
  @Prop({ unique: true, required: true })
  userId: string;

  @Prop({ unique: true, required: true })
  bioLink: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({default: ''})
  fullName: string;

  @Prop({
    type: {
      url: { type: String, required: true },
      publicId: { type: String, default: '' }
    },
    default: {
      publicId: ''
    }
  })
  avatar: {
    url: string;
    publicId: string;
  };

  @Prop({default: ''})
  jobId: string;

  @Prop({default: ''})
  jobTitle: string;

  @Prop({default: ''})
  description: string;

  @Prop([
    {
      platform: String,
      description: String,
      link: String,
    },
  ])
  socialMedias: Array<{
    platform: string;
    description: string;
    link: string;
  }>;

  @Prop([
    {
      title: String,
      content: String,
    },
  ])
  infors: Array<{
    title: string;
    content: string;
  }>;

  @Prop([String])
  tags: string[];

  @Prop({
    type: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    default: {
      publicId: ''
    }
  })
  instructionVideo: {
    url: string;
    publicId: string;
  };

  @Prop([
    {
      index: Number,
      type: {
        type: String,
        enum: ['grid', 'slider', 'list', 'banner'],
      },
      title: String,
      imageInfos: [
        {
          index: Number,
          description: String,
          url: String,
          clickLink: String,
          publicId: String
        },
      ],
    },
  ])
  mediaWidgets: Array<{
    index: number;
    type: 'grid' | 'slider' | 'list' | 'banner';
    title: string;
    imageInfos: Array<{
      index: number;
      description: string;
      url: string;
      clickLink: string;
      publicId: string
    }>;
  }>;

  @Prop([
    {
      index: Number,
      title: String,
      content: String,
    },
  ])
  tabs: Array<{
    index: number;
    title: string;
    content: string;
  }>;
}

export const BioSchema = SchemaFactory.createForClass(Bio);