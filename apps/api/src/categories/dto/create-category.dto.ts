import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Vợt Cầu Lông',
    description: 'Tên của danh mục sản phẩm',
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MaxLength(100, { message: 'Tên danh mục tối đa 100 ký tự' })
  name: string;

  @ApiPropertyOptional({
    example: 'vot-cau-long',
    description: 'Đường dẫn tĩnh duy nhất của danh mục (tự động tạo nếu để trống)',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Danh mục các loại vợt cầu lông chính hãng Yonex, Lining, Victor...',
    description: 'Mô tả chi tiết danh mục',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE,
    description: 'Trạng thái hoạt động của danh mục',
  })
  @IsEnum(CategoryStatus, { message: 'Trạng thái không hợp lệ (ACTIVE hoặc INACTIVE)' })
  @IsOptional()
  status?: CategoryStatus;
}
