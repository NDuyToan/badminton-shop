import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum SortByOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  CREATED_AT_DESC = 'created_at_desc',
  NAME_ASC = 'name_asc',
}

export class QueryProductsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsString()
  @IsOptional()
  playStyle?: string; // vd: "Công thủ toàn diện", "Thiên công", "Phản tạt tì đè"

  @IsString()
  @IsOptional()
  weight?: string; // vd: "3U", "4U", "5U"

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isFeatured?: boolean;

  @IsEnum(SortByOption)
  @IsOptional()
  sortBy?: SortByOption = SortByOption.CREATED_AT_DESC;
}
