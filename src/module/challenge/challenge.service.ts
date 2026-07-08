import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../lib/database/prisma.service';
import { ChallengeDto } from './dto/challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

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
}
