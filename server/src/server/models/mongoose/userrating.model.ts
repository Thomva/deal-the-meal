import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReview } from '../mongoose';
import { Review } from './review.model';

interface IUserrating extends Document {
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _reviewIds: Array<IReview['_id']>;

  reviews: any;
}

const UserratingSchema: Schema = new Schema(
  {
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    _reviewIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: false,
        default: [],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserratingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_reviewIds',
  foreignField: '_id',
  justOne: false,
});
UserratingSchema.virtual('average').get(function(this: IUserrating) {
  const reviews: Array<IReview> = this.get('reviews');
  let average: number = null;
  if (!reviews) return null;

  if (reviews.length > 0) {
    let total: number = 0;
    average = 0;

    for (let i = 0; i < reviews.length; i++) {
      total += reviews[i].rating;
    }

    average = total / reviews.length;
  }

  return average;
});

async function removeCascade(this: IUserrating, next: any) {
  // Remove userrating
  const reviews = await Review.find({ _id: { $in: this._reviewIds } });
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    await review.remove();
  }

  next();
}

UserratingSchema.pre('findOneAndRemove', removeCascade);
UserratingSchema.pre('remove', removeCascade);

const Userrating = mongoose.model<IUserrating>('Userrating', UserratingSchema);

export { IUserrating, Userrating };
