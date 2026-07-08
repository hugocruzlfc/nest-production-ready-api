import { PartialType } from '@nestjs/mapped-types';

import { ChallengeDto } from './challenge.dto';

export class UpdateChallengeDto extends PartialType(ChallengeDto) {}
