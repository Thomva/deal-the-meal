import mongoose, { Schema, Document, Model } from 'mongoose';

interface IRole extends Document {
  name: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: false, max: 128 },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Role = mongoose.model<IRole>('Role', RoleSchema);

export { IRole, Role };
