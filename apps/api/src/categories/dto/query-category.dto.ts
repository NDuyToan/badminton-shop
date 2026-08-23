import { ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryCategoryDto {
  @ApiPropertyOptional({
    enum: CategoryStatus,
    description: 'Lọc theo trạng thái danh mục',
  })
  @IsEnum(CategoryStatus)
  @IsOptional()
  status?: CategoryStatus;

  @ApiPropertyOptional({
    description: 'Tìm kiếm danh mục theo tên',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
