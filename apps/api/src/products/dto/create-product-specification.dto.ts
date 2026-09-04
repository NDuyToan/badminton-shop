import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductSpecificationDto {
  @IsString()
  @IsOptional()
  weight?: string; // e.g. "3U (88g)", "4U (83g)", "5U"

  @IsString()
  @IsOptional()
  gripSize?: string; // e.g. "G5", "G6", "S2"

  @IsInt()
  @IsOptional()
  balancePoint?: number; // mm, e.g. 296

  @IsString()
  @IsOptional()
  stiffness?: string; // e.g. "Dẻo", "Trung bình", "Cứng"

  @IsString()
  @IsOptional()
  maxTension?: string; // e.g. "30 lbs / 13.5 kg"

  @IsString()
  @IsOptional()
  frameMaterial?: string; // e.g. "Carbon Fiber / TB NANO"

  @IsString()
  @IsOptional()
  shaftMaterial?: string; // e.g. "UHB SHAFT / Carbon Fiber"

  @IsString()
  @IsOptional()
  playStyle?: string; // e.g. "Công thủ toàn diện", "Thiên công", "Phản tạt tì đè"

  @IsString()
  @IsOptional()
  shoeSize?: string; // e.g. "39 - 44"

  @IsString()
  @IsOptional()
  shoeUpper?: string; // e.g. "Synthetic Leather + Textile"

  @IsString()
  @IsOptional()
  shoeSole?: string; // e.g. "Rubber Outsole + Phylon Midsole"

  @IsString()
  @IsOptional()
  origin?: string; // e.g. "China", "Japan", "Vietnam"
}
