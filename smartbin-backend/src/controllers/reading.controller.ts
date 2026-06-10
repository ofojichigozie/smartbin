import { Request, Response, NextFunction } from 'express';
import {
  createReading,
  getReadings,
  getReadingsByBin,
  deleteReading,
} from '../services/reading.service';
import { CreateReadingInput } from '../validations/reading.validation';

export const postReading = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reading = await createReading(req.body as CreateReadingInput);
    res
      .status(201)
      .json({ status: 'success', message: 'Reading recorded successfully', data: reading });
  } catch (error) {
    next(error);
  }
};

export const fetchReadings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { binId, limit } = req.query;
    const readings = await getReadings(
      binId as string | undefined,
      limit ? parseInt(limit as string, 10) : 50,
    );
    res
      .status(200)
      .json({ status: 'success', message: 'Readings fetched successfully', data: readings });
  } catch (error) {
    next(error);
  }
};

export const fetchReadingsByBin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { binId } = req.params;
    const { limit } = req.query;
    const readings = await getReadingsByBin(binId, limit ? parseInt(limit as string, 10) : 100);
    res
      .status(200)
      .json({ status: 'success', message: 'Bin readings fetched successfully', data: readings });
  } catch (error) {
    next(error);
  }
};

export const removeReading = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const reading = await deleteReading(id);
    res
      .status(200)
      .json({ status: 'success', message: 'Reading deleted successfully', data: reading });
  } catch (error) {
    next(error);
  }
};
