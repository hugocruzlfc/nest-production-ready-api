import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  // Guaranteed present at runtime — env.validation.ts fails startup otherwise.
  url: process.env.DATABASE_URL as string,
}));
