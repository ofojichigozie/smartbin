import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  adminId: string;
  email: string;
}

export interface AuthRequest extends Request {
  admin?: AuthPayload;
}
