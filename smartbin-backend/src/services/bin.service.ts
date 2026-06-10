import { Bin } from '../models/Bin';
import { Reading } from '../models/Reading';
import { AppError } from '../utils/AppError';

export const getAllBins = async () => {
  const bins = await Bin.find().sort({ binId: 1 });

  const binsWithLatestReading = await Promise.all(
    bins.map(async (bin) => {
      const latestReading = await Reading.findOne({ binId: bin.binId }).sort({ timestamp: -1 });
      return { ...bin.toObject(), latestReading };
    }),
  );

  return binsWithLatestReading;
};

export const getBinById = async (binId: string) => {
  const bin = await Bin.findOne({ binId: binId.toUpperCase() });
  if (!bin) throw new AppError(404, `Bin '${binId}' not found`);

  const latestReading = await Reading.findOne({ binId: bin.binId }).sort({ timestamp: -1 });
  return { ...bin.toObject(), latestReading };
};
