import { registerAs } from '@nestjs/config';

export default registerAs('logger', () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const defaultLevel = nodeEnv === 'production' ? 'info' : 'debug';

  return {
    level: process.env.LOG_LEVEL || defaultLevel,
  };
});
