import { default as mongoose, Schema, Document } from 'mongoose';
import { default as bcrypt } from 'bcrypt';

import { IMessage } from './message.model';
import { IUserrating, Userrating } from './userrating.model';
import { IRole } from './role.model';
import { IItem } from './item.model';
import { ILocation, Location } from './location.model';

interface ILocalProvider {
  password: string;
}

interface IFacebookProvider {
  id: string;
  token: string;
}

interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  // location: string;
  showLastName: boolean;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  localProvider?: ILocalProvider;
  facebookProvider?: IFacebookProvider;

  _roleIds: Array<IRole['_id']>;
  _userratingId: IUserrating['_id'];
  _messageIds?: Array<IMessage['_id']>;
  _itemIds?: Array<IItem['_id']>;
  _locationId?: Array<ILocation['_id']>;

  messages: IMessage[];
  items: IItem[];
  location: ILocation;
  userrating: any;

  comparePassword(candidatePassword: String, cb: Function): void;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, maxlength: 20 },
    lastName: { type: String, required: true, maxlength: 40 },
    showLastName: { type: Boolean, required: false, default: false },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    localProvider: {
      password: {
        type: String,
        required: false,
      },
    },
    facebookProvider: {
      id: {
        type: String,
        required: false,
      },
      token: {
        type: String,
        required: false,
      },
    },
    _roleIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
      },
    ],
    _userratingId: {
      type: Schema.Types.ObjectId,
      ref: 'Userrating',
      required: true,
    },
    _locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    _messageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: false,
      },
    ],
    _itemIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: false,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre<IUser>('save', function(next) {
  const user: IUser = this as IUser;

  if (!user.isModified('localProvider.password')) return next();

  try {
    return bcrypt.genSalt(10, (errSalt, salt) => {
      if (errSalt) throw errSalt;

      bcrypt.hash(user.localProvider.password, salt, (errHash, hash) => {
        if (errHash) throw errHash;

        user.localProvider.password = hash;
        return next();
      });
    });
  } catch (err) {
    return next(err);
  }
});

userSchema.virtual('id').get(function(this: IUser) {
  return this._id;
});
userSchema.virtual('name').get(function(this: IUser) {
  return this.showLastName
    ? `${this.firstName} ${this.lastName}`
    : this.firstName;
});
userSchema.virtual('password').get(function(this: IUser) {
  return this.localProvider.password;
});
userSchema.virtual('userrating', {
  ref: 'Userrating',
  localField: '_userratingId',
  foreignField: '_id',
  justOne: true,
});
userSchema.virtual('location', {
  ref: 'Location',
  localField: '_locationId',
  foreignField: '_id',
  justOne: true,
});
userSchema.virtual('roles', {
  ref: 'Role',
  localField: '_roleIds',
  foreignField: '_id',
  justOne: false,
});
userSchema.virtual('messages', {
  ref: 'Message',
  localField: '_messageIds',
  foreignField: '_id',
  justOne: false,
});
userSchema.virtual('items', {
  ref: 'Item',
  localField: '_itemIds',
  foreignField: '_id',
  justOne: false,
});

userSchema.methods.comparePassword = function(
  candidatePassword: String,
  cb: Function,
) {
  const user = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) return cb(err, null);
    return cb(null, isMatch);
  });
};

async function removeCascade(this: IUser, next: any) {
  // Remove userrating
  const userrating = await Userrating.findById(this._userratingId);
  userrating && (await userrating.remove());
  
  // Remove location
  const location = await Location.findById(this._locationId);
  location && (await location.remove());

  next();
}

userSchema.pre('findOneAndRemove', removeCascade);
userSchema.pre('remove', removeCascade);

const User = mongoose.model<IUser>('User', userSchema);

export { IUser, User, userSchema };
