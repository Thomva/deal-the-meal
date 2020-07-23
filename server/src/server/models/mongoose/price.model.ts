import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../mongoose';

interface IPrice extends Document {
  amount: number;
  currency: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

const PriceSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true, unique: false, max: 999 },
    currency: {
      type: String,
      enum: ['€', '$', '£'],
      required: true,
      unique: false,
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Price = mongoose.model<IPrice>('Price', PriceSchema);

export { IPrice, Price };
