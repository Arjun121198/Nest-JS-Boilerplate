import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { encode as jwtEncode } from 'cva-jwt';

@Schema()
export class Admin extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: true })
  is_primary: boolean;

  @Prop({ required: true })
  authorisation: string;

  @Prop({ required: false , default: 0 })
  status : number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

AdminSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; 
    return ret;
  },
});
AdminSchema.virtual('user_type').get(function () {
  return 'admin';
});

AdminSchema.virtual('base_url').get(function () {
  return 'admin';
});

AdminSchema.pre('validate', async function (next) {
  try {
    this.authorisation = jwtEncode(this, process.env.JWT_SECRET, 'HS256');

    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    next();
  } catch (error) {
    next(error); 
  }
});