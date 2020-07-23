import { default as mongoose, Document, Schema } from 'mongoose';
import { IUser, User } from './user.model';
import { IItem } from './item.model';

interface IMessage extends Document {
  body: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _senderId: IUser['_id'];
  _receiverId: IUser['_id'];
  _itemId: IItem['_id'];
}

const messageSchema: Schema = new Schema(
  {
    body: { type: String, required: true, unique: false, max: 2056 },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    _senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    _itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

messageSchema.virtual('sender', {
  ref: 'User',
  localField: '_senderId',
  foreignField: '_id',
  justOne: true,
});
messageSchema.virtual('receiver', {
  ref: 'User',
  localField: '_receiverId',
  foreignField: '_id',
  justOne: true,
});
messageSchema.virtual('item', {
  ref: 'Item',
  localField: '_itemId',
  foreignField: '_id',
  justOne: true,
});

async function removeFromUsers(this: any, next: any) {
  const sender = await User.findByIdAndUpdate(
    this._senderId,
    { $pullAll: { _messageIds: [this._id] } },
    { new: true },
  );
  const receiver = await User.findByIdAndUpdate(
    this._receiverId,
    { $pullAll: { _messageIds: [this._id] } },
    { new: true },
  );
  await sender.save();
  await receiver.save();

  next();
}

messageSchema.pre('findOneAndRemove', removeFromUsers);
messageSchema.pre('remove', removeFromUsers);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export { IMessage, Message, messageSchema };
