import { Bin } from '../models/Bin';
import { Reading } from '../models/Reading';

const SEED_BIN = {
  binId: 'BIN-001',
  name: 'Main Entrance Bin',
  location: 'Main Entrance',
  heightCm: 60,
  warningThreshold: 80,
  criticalThreshold: 95,
};

const READING_COUNT = 50;
const INTERVAL_MINUTES = 5; // Simulated reading every 5 minutes

export const seedReadings = async (): Promise<void> => {
  // Ensure the bin exists
  let bin = await Bin.findOne({ binId: SEED_BIN.binId });

  if (!bin) {
    bin = await Bin.create(SEED_BIN);
    console.log(`[Seeder] Bin seeded → ${SEED_BIN.binId}`);
  } else {
    console.log(`[Seeder] Bin ${SEED_BIN.binId} already exists — skipping bin creation.`);
  }

  const existingCount = await Reading.countDocuments({ binId: SEED_BIN.binId });

  if (existingCount >= READING_COUNT) {
    console.log(`[Seeder] Readings already seeded (${existingCount} records) — skipping.`);
    return;
  }

  const now = Date.now();
  const intervalMs = INTERVAL_MINUTES * 60 * 1000;

  const readings = Array.from({ length: READING_COUNT }, (_, i) => {
    const timestamp = new Date(now - (READING_COUNT - i) * intervalMs);

    // Simulate a gradual fill from ~10% to ~90% with slight random noise
    const baseFill = 10 + (i / (READING_COUNT - 1)) * 80;
    const noise = (Math.random() - 0.5) * 6;
    const fillPercentage = parseFloat(Math.min(Math.max(baseFill + noise, 0), 100).toFixed(2));
    const distanceCm = parseFloat((bin!.heightCm * (1 - fillPercentage / 100)).toFixed(2));

    return {
      bin: bin!._id,
      binId: bin!.binId,
      distanceCm,
      fillPercentage,
      timestamp,
    };
  });

  await Reading.insertMany(readings);
  console.log(`[Seeder] ${READING_COUNT} readings seeded for ${SEED_BIN.binId}`);
};
