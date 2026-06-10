import { Bin } from '../models/Bin';
import { Reading } from '../models/Reading';
import { getSocket } from '../config/socket';
import { CreateReadingInput } from '../validations/reading.validation';
import { AppError } from '../utils/AppError';

export const createReading = async (input: CreateReadingInput) => {
  const binId = input.binId.toUpperCase();
  const bin = await Bin.findOne({ binId });
  if (!bin) throw new AppError(404, `Bin '${binId}' not found`);

  // Calculate fill level — clamp between 0 and 100
  const raw = ((bin.heightCm - input.distanceCm) / bin.heightCm) * 100;
  const fillPercentage = parseFloat(Math.min(Math.max(raw, 0), 100).toFixed(2));

  const reading = await Reading.create({
    bin: bin._id,
    binId: bin.binId,
    distanceCm: input.distanceCm,
    fillPercentage,
    timestamp: new Date(),
  });

  const io = getSocket();

  // Broadcast the new reading to all connected frontend clients
  io.emit('bin:reading', {
    binId: bin.binId,
    binName: bin.name,
    location: bin.location,
    fillPercentage,
    distanceCm: input.distanceCm,
    timestamp: reading.timestamp,
  });

  // Emit an alert if fill level crosses the bin's configured thresholds
  if (fillPercentage >= bin.criticalThreshold) {
    io.emit('bin:alert', {
      binId: bin.binId,
      binName: bin.name,
      location: bin.location,
      fillPercentage,
      level: 'critical',
      message: `${bin.name} is full and needs immediate attention!`,
    });
  } else if (fillPercentage >= bin.warningThreshold) {
    io.emit('bin:alert', {
      binId: bin.binId,
      binName: bin.name,
      location: bin.location,
      fillPercentage,
      level: 'warning',
      message: `${bin.name} is almost full (${fillPercentage}%)`,
    });
  }

  return reading;
};

export const getReadings = async (binId?: string, limit = 50) => {
  const query = binId ? { binId: binId.toUpperCase() } : {};
  return Reading.find(query).sort({ timestamp: -1 }).limit(limit);
};

export const getReadingsByBin = async (binId: string, limit = 100) => {
  return Reading.find({ binId: binId.toUpperCase() }).sort({ timestamp: -1 }).limit(limit);
};

export const deleteReading = async (id: string) => {
  const reading = await Reading.findByIdAndDelete(id);
  if (!reading) throw new AppError(404, 'Reading not found');
  return reading;
};
