// TODO: also cover BETTER_AUTH_SECRET < 32 chars, invalid BETTER_AUTH_URL,
// empty LOG_LEVEL -> undefined, and the NODE_ENV/PORT/ARCJET_MODE defaults.

import { validate } from './env.validation';

describe('validate', () => {
  it('throws if DATABASE_URL is missing', () => {
    const config = {
      BETTER_AUTH_SECRET: 'a'.repeat(32),
      BETTER_AUTH_URL: 'http://localhost:3000',
      ARCJET_KEY: 'ajkey_test',
    };

    expect(() => validate(config)).toThrow('Config validation error');
  });
});
