import { Schema, Document } from 'mongoose';

export const BrandaccountSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, required: true },
    password: { type: String, required: true },
    phone_number: { type: Number, unique: true, sparse: true },
    address: { type: String },
    bio: { type: String, default: null },
    dob: { type: String, default: null },
    profile_image: { type: String, default: null },
    subscription_status: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    authentication_token: { type: String, unique: true, sparse: true, default: null },
    otp: { type: Number },
    reset_token: { type: String, default: null },
    token_expires: { type: String, default: null },
    email_verified: { type: Number, enum: [0, 1], default: 0 },
    device_type: { type: String, default: null },
    os: { type: String, default: null },
    browser: { type: String, default: null },
    ip: { type: String, default: null },
    user_agent: { type: String, default: null },
    last_used: { type: Date, default: Date.now },
    is_deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export interface Brandaccount extends Document {
  name: string;
  email: string;
  password: string;
  phone_number?: number;
  address?: string;
  bio?: string;
  dob?: string;
  profile_image?: string;
  subscription_status?: boolean;
  status: string;
  authentication_token?: string;
  otp?: number;
  reset_token?: string;
  token_expires?: string;
  email_verified?: number;
  device_type?: string;
  os?: string;
  browser?: string;
  ip?: string;
  user_agent?: string;
  last_used?: Date;
  is_deleted?: boolean;
  description?: string; // Added field
  createdAt: Date; // Added field
}
