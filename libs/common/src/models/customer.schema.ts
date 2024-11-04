import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ default: "" })
  googleId: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: "" })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: "" })
  phoneNumber: string;

  @Prop({
    type: {
      url: { type: String, required: true },
      publicId: { type: String, default: "" }
    },
    default: {
      publicId: ""
    }
  })
  avatar: {
    url: string;
    publicId: string;
    resourceType: string;
  };

  @Prop({
    type: {
      street: { type: String },
      ward: {
        type: Object,
        default: {
          wardName: "",
          wardCode: "" // Thêm trường WardCode vào ward
        }
      },
      district: {
        type: Object,
        default: {
          districtName: "",
          districtID: "" // Thêm trường DistrictID vào district
        }
      },
      province: {
        type: Object,
        default: {
          provinceName: "",
          provinceID: "" // Thêm trường ProvinceID vào province
        }
      },
      country: { type: String, default: "Vietnam" }

    },
    default: {}
  })
  address: {
    street: string;
    ward: {
      wardName: string;
      wardCode: string;
    };
    district: {
      districtName: string;
      districtID: number;
    };
    province: {
      provinceName: string;
      provinceID: number;
    };
    country: string;
  };

  @Prop()
  dateOfBirth: Date;

  @Prop({ enum: ['Male', 'Female', 'Other'], default: 'Other' })
  gender: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  forgotPwToken: string;

  @Prop()
  sendForgotPwExp: number;

  @Prop({
    type: {
      code: { type: String, default: "VND" },
      exchangeRate: { type: Number, default: 1 }
    },
  })
  currency: {
    code: string;
    exchangeRate: number;
  };

  @Prop({ default: "free", enum: ['free', 'starter', 'pro', 'premium'] })
  planType: string;

  @Prop()
  lastLoginTime: Date;

  @Prop({ type: Date })
  accountExpiryDate: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);


@Schema({ timestamps: true })
export class Rate extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  exchangeRate: number;
}

export const RateSchema = SchemaFactory.createForClass(Rate);