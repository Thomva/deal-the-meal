import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../mongoose';
import { User } from './user.model';
import { Userrating, IUserrating } from './userrating.model';

interface IReview extends Document {
  rating: number;
  message: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _userId: IUser['_id'];
}

const ReviewSchema: Schema = new Schema(
  {
    rating: { type: Number, required: true, unique: false, max: 5 },
    message: { type: String, required: true, unique: false, maxlength: 350 },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },

    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ReviewSchema.virtual('assessor', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

async function removeCascade(this: IReview, next: any) {
  // Remove from userrating
  let foundUserrating: IUserrating;
  const users = await User.find();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const userrating = await Userrating.findById(user._userratingId)
      .populate('reviews')
      .exec();
    const reviews = userrating && userrating.reviews;
    const rev = reviews.find(
      (review: any) =>
        JSON.stringify(review._userId) === JSON.stringify(this._userId),
    );

    if (rev) {
      foundUserrating = user._userratingId;
    }
  }

  if (!!foundUserrating) {
    await Userrating.findByIdAndUpdate(foundUserrating._id, {
      $pullAll: { _reviewIds: [this._id] },
    });
  }

  next();
}

ReviewSchema.pre('findOneAndRemove', removeCascade);
ReviewSchema.pre('remove', removeCascade);

const Review = mongoose.model<IReview>('Review', ReviewSchema);

export { IReview, Review };
