// src/admin/schemas/admin.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface AdminDocument extends Document {
  username: string;
  password: string;
  status: string;
  lastAccessed: Date;
  comparePassword(password: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: Date.now })
  lastAccessed: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Định nghĩa phương thức comparePassword trên schema
AdminSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Middleware để băm mật khẩu trước khi lưu
AdminSchema.pre<AdminDocument>('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
});
