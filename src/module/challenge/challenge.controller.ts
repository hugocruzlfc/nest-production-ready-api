import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

import { auth } from '../../lib/auth/auth';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ChallengeService } from './challenge.service';
import { ChallengeDto } from './dto/challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  findAll() {
    return this.challengeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengeService.findOne(id);
  }

  @Post()
  @Roles(['ADMIN'])
  @ResponseMessage('Challenge created successfully')
  create(
    @Body() dto: ChallengeDto,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.challengeService.create(dto, session.user.id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  @ResponseMessage('Challenge updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateChallengeDto) {
    return this.challengeService.update(id, dto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @ResponseMessage('Challenge deleted successfully')
  remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }

  @Post(':id/join')
  @Roles(['PARTICIPANT'])
  @ResponseMessage('Successfully joined challenge')
  join(
    @Param('id') id: string,
    @Session() session: UserSession<typeof auth>,
  ) {
    return this.challengeService.join(id, session.user.id);
  }
}
