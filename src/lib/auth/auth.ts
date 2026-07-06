import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { PrismaClient } from '../../generated/prisma/client';

// Better Auth needs a concrete instance at module-config time, before Nest's
// DI container exists, so this can't go through the injected PrismaService.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: ['PARTICIPANT', 'ADMIN'],
        required: false,
        defaultValue: 'PARTICIPANT',
        input: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
