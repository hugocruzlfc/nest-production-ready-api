import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../lib/database/prisma.service';
import { ChallengeDto } from './dto/challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.challenge.findMany();
  }

  async findOne(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with id ${id} not found`);
    }

    return challenge;
  }

  create(dto: ChallengeDto, authorId: string) {
    const { startsAt, endsAt, ...rest } = dto;

    return this.prisma.challenge.create({
      data: {
        ...rest,
        startDate: startsAt,
        endDate: endsAt,
        authorId,
      },
    });
  }

  async update(id: string, dto: UpdateChallengeDto) {
    await this.findOne(id);

    const { startsAt, endsAt, ...rest } = dto;

    return this.prisma.challenge.update({
      where: { id },
      data: {
        ...rest,
        ...(startsAt && { startDate: startsAt }),
        ...(endsAt && { endDate: endsAt }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.challenge.delete({ where: { id } });
  }

  async join(challengeId: string, userId: string) {
    const challenge = await this.findOne(challengeId);

    if (!challenge.isActive) {
      throw new BadRequestException('Challenge is not active');
    }

    if (challenge.endDate < new Date()) {
      throw new BadRequestException('Challenge has already ended');
    }

    try {
      return await this.prisma.challengeParticipant.create({
        data: { challengeId, userId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new BadRequestException('Already joined this challenge');
      }

      throw error;
    }
  }
}
