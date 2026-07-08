import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';

export class ChallengeDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @Type(() => Date)
  @MinDate(() => new Date())
  startsAt!: Date;

  @Type(() => Date)
  @MinDate(() => new Date())
  endsAt!: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
