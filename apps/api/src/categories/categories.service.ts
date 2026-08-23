import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slug.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.name);

    if (!slug) {
      throw new BadRequestException('Không thể tạo slug từ tên danh mục');
    }

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(`Slug '${slug}' đã tồn tại`);
    }

    return this.prisma.category.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description?.trim() || null,
        status: dto.status,
      },
    });
  }

  async findAll(query?: QueryCategoryDto) {
    const where: Prisma.CategoryWhereInput = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.search?.trim()) {
      where.name = {
        contains: query.search.trim(),
        mode: 'insensitive',
      };
    }

    return this.prisma.category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với slug '${slug}'`);
    }

    return category;
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id '${id}'`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id '${id}'`);
    }

    let slug = category.slug;
    if (dto.slug !== undefined || dto.name !== undefined) {
      const targetText = dto.slug?.trim() ? dto.slug : (dto.name || category.name);
      slug = slugify(targetText);

      if (slug !== category.slug) {
        const existing = await this.prisma.category.findUnique({
          where: { slug },
        });
        if (existing && existing.id !== id) {
          throw new ConflictException(`Slug '${slug}' đã tồn tại`);
        }
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() || null,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với id '${id}'`);
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục '${category.name}' vì đang có ${category._count.products} sản phẩm liên kết. Vui lòng chuyển trạng thái sang INACTIVE.`
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
