import { Schema, model, Document } from 'mongoose';

export interface IBin extends Document {
  binId: string;
  name: string;
  location: string;
  heightCm: number;
  warningThreshold: number;
  criticalThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const binSchema = new Schema<IBin>(
  {
    binId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    heightCm: { type: Number, required: true, min: 1 },
    warningThreshold: { type: Number, default: 80, min: 0, max: 100 },
    criticalThreshold: { type: Number, default: 95, min: 0, max: 100 },
  },
  { timestamps: true },
);

export const Bin = model<IBin>('Bin', binSchema);
