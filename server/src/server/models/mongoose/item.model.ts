import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { default as slug } from 'slug';
import { ICategory } from './category.model';
import { IUser, User } from './user.model';
import { IPrice, Price } from './price.model';
import { Message } from './message.model';
import { unlinkSync, existsSync } from 'fs';

interface IItem extends Document {
  title: string;
  description: string;
  imageUrls: Array<string>;
  slug: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _categoryIds: Array<ICategory['_id']>;
  _priceId: IPrice['_id'];
  _userId: IUser['_id'];

  slugify(): void;
}

interface IItemModel extends PaginateModel<IItem> {}

const itemSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      max: 30,
    },
    description: {
      type: String,
      required: true,
      maxlength: 600,
    },
    imageUrls: [String],
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _priceId: {
      type: Schema.Types.ObjectId,
      ref: 'Price',
      required: true,
    },
    _categoryIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

itemSchema.methods.slugify = function() {
  this.slug = slug(this.title);
};

itemSchema.pre<IItem>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

itemSchema.virtual('id').get(function(this: IItem) {
  return this._id;
});
itemSchema.virtual('price', {
  ref: 'Price',
  localField: '_priceId',
  foreignField: '_id',
  justOne: true,
});
itemSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});
itemSchema.virtual('categories', {
  ref: 'Category',
  localField: '_categoryIds',
  foreignField: '_id',
  justOne: false,
});

async function removeCascade(this: IItem, next: any) {
  // Remove from owner's items
  const owner = await User.findById(this._userId);
  await owner.update({ $pullAll: { _itemIds: [this._id] } });
  await owner.save();

  // Remove price
  const price = await Price.findByIdAndRemove(this._priceId);

  // Remove message
  const messages = await Message.find({ _itemId: this._id });
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    await message.remove();
  }

  // Remove image files
  this.imageUrls.forEach((url: any) => {
    if (url && existsSync(url)) {
      url && url.startsWith('uploads/') && unlinkSync(url);
    }
  });

  next();
}

itemSchema.pre('findOneAndRemove', removeCascade);
itemSchema.pre('remove', removeCascade);

itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model<IItem, IItemModel>('Item', itemSchema);

export { IItem, Item, itemSchema };
