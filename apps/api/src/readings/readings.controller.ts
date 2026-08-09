import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ReadingStatus } from '@prisma/client';
import { ReadingsService } from './readings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateReadingDto {
  @IsString() @MinLength(4) period!: string;
  @Type(() => Number) @IsNumber() @Min(0) kwh!: number;
  @IsOptional() @Type(() => Number) @IsNumber() costEur?: number;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() homeLabel?: string;
}
class StatusDto {
  @IsEnum(ReadingStatus) status!: ReadingStatus;
  @IsOptional() @IsString() advisorNote?: string;
}

@Controller('readings')
@UseGuards(JwtAuthGuard)
export class ReadingsController {
  constructor(private readings: ReadingsService) {}

  @Get()
  list(@Req() req: { user: { userId: string; role: 'RESIDENT' | 'ADVISOR' } }) {
    return this.readings.list(req.user.userId, req.user.role);
  }

  @Get('stats/summary')
  stats(@Req() req: { user: { userId: string; role: 'RESIDENT' | 'ADVISOR' } }) {
    return this.readings.summary(req.user.userId, req.user.role);
  }

  @Get(':id')
  get(@Param('id') id: string, @Req() req: { user: { userId: string; role: 'RESIDENT' | 'ADVISOR' } }) {
    return this.readings.get(id, req.user.userId, req.user.role);
  }

  @Post()
  create(
    @Body() dto: CreateReadingDto,
    @Req() req: { user: { userId: string; role: 'RESIDENT' | 'ADVISOR' } },
  ) {
    return this.readings.create(req.user.userId, req.user.role, dto);
  }

  @Patch(':id/status')
  status(
    @Param('id') id: string,
    @Body() dto: StatusDto,
    @Req() req: { user: { userId: string; role: 'RESIDENT' | 'ADVISOR' } },
  ) {
    return this.readings.updateStatus(id, req.user.userId, req.user.role, dto.status, dto.advisorNote);
  }
}
