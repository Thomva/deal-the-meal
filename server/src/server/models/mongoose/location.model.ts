import { default as mongoose, Schema, Document } from 'mongoose';

interface ILocation extends Document {
  name: string;
  latitude: string;
  longitude: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
}

const locationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);


locationSchema.virtual('id').get(function(this: ILocation) {
  return this._id;
});

const Location = mongoose.model<ILocation>('Location', locationSchema);

export { ILocation, Location, locationSchema };
