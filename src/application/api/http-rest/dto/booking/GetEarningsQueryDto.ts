import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export enum PeriodType {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class GetEarningsQueryDto {
  
  @ApiPropertyOptional({ 
    enum: PeriodType,
    description: 'Khoảng thời gian báo cáo',
    default: PeriodType.MONTH,
    example: 'month'
  })
  @IsOptional()
  @IsEnum(PeriodType, {
    message: 'Period must be one of: week, month, year'
  })
  period?: PeriodType = PeriodType.MONTH;
}

