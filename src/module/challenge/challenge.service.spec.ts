// TODO: also cover findOne (not found), create (startsAt/endsAt mapping),
// update (calls findOne first, partial date mapping), remove (calls findOne first),
// join's endDate-passed rejection, and the P2002 -> BadRequestException translation.

import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../lib/database/prisma.service';
import { ChallengeService } from './challenge.service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let prisma: { challenge: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      challenge: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
  });

  it('join() rejects if the challenge is not active', async () => {
    prisma.challenge.findUnique.mockResolvedValue({
      id: 'challenge-1',
      isActive: false,
      endDate: new Date('2999-01-01'),
    });

    await expect(service.join('challenge-1', 'user-1')).rejects.toThrow(
      BadRequestException,
    );
  });
});
