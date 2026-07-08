import { registerAs } from '@nestjs/config';

// ARCJET_ENV and ARCJET_MODE are intentionally not part of this namespace:
// @arcjet/env reads them directly from process.env internally, so there is
// nothing for our ConfigService to wire them into. They are still validated
// in env.validation.ts so a bad value fails fast at boot.
export default registerAs('arcjet', () => ({
  // Guaranteed present at runtime — env.validation.ts fails startup otherwise.
  key: process.env.ARCJET_KEY as string,
}));
