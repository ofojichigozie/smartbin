import { Request, Response, NextFunction } from 'express';
import { getAllBins, getBinById } from '../services/bin.service';

export const fetchBins = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const bins = await getAllBins();
    res.status(200).json({ status: 'success', message: 'Bins fetched successfully', data: bins });
  } catch (error) {
    next(error);
  }
};

export const fetchBin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { binId } = req.params;
    const bin = await getBinById(binId);
    res.status(200).json({ status: 'success', message: 'Bin fetched successfully', data: bin });
  } catch (error) {
    next(error);
  }
};
