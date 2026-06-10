import { Schema, model, Document, Types } from 'mongoose';

export interface IReading extends Document {
  bin: Types.ObjectId;
  binId: string;
  distanceCm: number;
  fillPercentage: number;
  timestamp: Date;
}

const readingSchema = new Schema<IReading>(
  {
    bin: { type: Schema.Types.ObjectId, ref: 'Bin', required: true },
    binId: { type: String, required: true },
    distanceCm: { type: Number, required: true, min: 0 },
    fillPercentage: { type: Number, required: true, min: 0, max: 100 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

// Optimise queries for dashboard (latest reading per bin, history charts)
readingSchema.index({ binId: 1, timestamp: -1 });

export const Reading = model<IReading>('Reading', readingSchema);
