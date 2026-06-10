import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';

// ⚠️  Change these credentials before deploying to production
const DEFAULT_ADMIN = {
  name: 'Administrator',
  username: 'admin',
  email: 'admin@smartbin.dev',
  password: 'Admin@Pass123',
};

export const seedAdmin = async (): Promise<void> => {
  const exists = await Admin.findOne({ email: DEFAULT_ADMIN.email });

  if (exists) {
    console.log('[Seeder] Admin already exists — skipping.');
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);

  await Admin.create({
    name: DEFAULT_ADMIN.name,
    username: DEFAULT_ADMIN.username,
    email: DEFAULT_ADMIN.email,
    password: hashedPassword,
  });

  console.log(`[Seeder] Admin seeded → ${DEFAULT_ADMIN.email}`);
};
