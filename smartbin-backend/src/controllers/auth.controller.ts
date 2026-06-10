import { Request, Response, NextFunction } from 'express';
import { loginAdmin } from '../services/auth.service';
import { LoginInput } from '../validations/auth.validation';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await loginAdmin(req.body as LoginInput);
    res.status(200).json({ status: 'success', message: 'Login successful', data: result });
  } catch (error) {
    next(error);
  }
};
