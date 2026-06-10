import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { env } from '../config/env';
import { LoginInput } from '../validations/auth.validation';
import { AppError } from '../utils/AppError';

export const loginAdmin = async (input: LoginInput) => {
  const admin = await Admin.findOne({ email: input.email });
  if (!admin) throw new AppError(401, 'Invalid credentials');

  const isMatch = await bcrypt.compare(input.password, admin.password);
  if (!isMatch) throw new AppError(401, 'Invalid credentials');

  const token = jwt.sign(
    { adminId: admin._id.toString(), email: admin.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }, // number (seconds) — avoids ms StringValue type clash
  );

  return {
    token,
    admin: { id: admin._id, name: admin.name, username: admin.username, email: admin.email },
  };
};
