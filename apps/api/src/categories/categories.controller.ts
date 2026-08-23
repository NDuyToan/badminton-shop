import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới danh mục sản phẩm (Admin)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Danh mục đã được tạo thành công' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Slug danh mục đã tồn tại' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dữ liệu không hợp lệ' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục (Public / Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Danh sách danh mục kèm số lượng sản phẩm' })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục theo slug (Public)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Thông tin chi tiết danh mục' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy danh mục' })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục theo ID (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Danh mục đã được cập nhật' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy danh mục' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Slug mới bị trùng lặp' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa danh mục theo ID (Admin)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Xóa danh mục thành công' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy danh mục' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Không thể xóa danh mục đang chứa sản phẩm',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
