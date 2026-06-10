import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthPayload, AuthRequest } from '../types';

/** Protect routes that require an authenticated admin (JWT in Authorization header). */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Unauthorised — missing token', data: null });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.admin = decoded;
    next();
  } catch {
    res
      .status(401)
      .json({ status: 'error', message: 'Unauthorised — invalid or expired token', data: null });
  }
};

/** Protect device-facing routes using a shared API key (x-api-key header). */
export const authenticateDevice = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== env.deviceApiKey) {
    res
      .status(401)
      .json({ status: 'error', message: 'Unauthorised — invalid device API key', data: null });
    return;
  }

  next();
};
