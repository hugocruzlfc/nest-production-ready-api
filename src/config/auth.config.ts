import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  // Guaranteed present at runtime — env.validation.ts fails startup otherwise.
  secret: process.env.BETTER_AUTH_SECRET as string,
  url: process.env.BETTER_AUTH_URL as string,
}));
