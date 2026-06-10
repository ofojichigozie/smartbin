import { z } from 'zod';

export const createReadingSchema = z.object({
  binId: z.string().min(1, 'Bin ID is required'),
  distanceCm: z
    .number({
      required_error: 'distanceCm is required',
      invalid_type_error: 'distanceCm must be a number',
    })
    .min(0, 'Distance cannot be negative'),
});

export type CreateReadingInput = z.infer<typeof createReadingSchema>;
