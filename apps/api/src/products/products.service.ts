import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto, SortByOption } from './dto/query-products.dto';
import { slugify } from '../common/utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    // Kiểm tra slug đã tồn tại chưa
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException(
        `Sản phẩm với slug '${slug}' đã tồn tại trong hệ thống`,
      );
    }

    // Kiểm tra danh mục
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Danh mục với id ${dto.categoryId} không tồn tại`,
      );
    }

    // Kiểm tra thương hiệu nếu có
    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) {
        throw new NotFoundException(
          `Thương hiệu với id ${dto.brandId} không tồn tại`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo Product
      const product = await tx.product.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          originalPrice: dto.originalPrice,
          salePrice: dto.salePrice,
          categoryId: dto.categoryId,
          brandId: dto.brandId,
          isFeatured: dto.isFeatured ?? false,
          isActive: dto.isActive ?? true,
          tags: dto.tags ?? [],
        },
      });

      // 2. Tạo Specification nếu có
      if (dto.specification) {
        await tx.productSpecification.create({
          data: {
            productId: product.id,
            weight: dto.specification.weight,
            gripSize: dto.specification.gripSize,
            balancePoint: dto.specification.balancePoint,
            stiffness: dto.specification.stiffness,
            maxTension: dto.specification.maxTension,
            frameMaterial: dto.specification.frameMaterial,
            shaftMaterial: dto.specification.shaftMaterial,
            playStyle: dto.specification.playStyle,
            shoeSize: dto.specification.shoeSize,
            shoeUpper: dto.specification.shoeUpper,
            shoeSole: dto.specification.shoeSole,
            origin: dto.specification.origin,
          },
        });
      }

      // 3. Tạo Images nếu có
      if (dto.images && dto.images.length > 0) {
        await tx.productImage.createMany({
          data: dto.images.map((img, index) => ({
            productId: product.id,
            url: img.url,
            altText: img.altText ?? dto.name,
            isThumbnail: img.isThumbnail ?? index === 0,
            displayOrder: img.displayOrder ?? index,
          })),
        });
      }

      // 4. Tạo Variants nếu có
      if (dto.variants && dto.variants.length > 0) {
        await tx.productVariant.createMany({
          data: dto.variants.map((v) => ({
            productId: product.id,
            sku: v.sku,
            title: v.title,
            price: v.price,
            originalPrice: v.originalPrice ?? dto.originalPrice,
            stockQuantity: v.stockQuantity ?? 0,
            color: v.color,
            size: v.size,
            imageUrl: v.imageUrl,
            isActive: v.isActive ?? true,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { displayOrder: 'asc' } },
          specification: true,
          variants: true,
        },
      });
    });
  }

  async findAll(query: QueryProductsDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.categorySlug) {
      where.category = {
        slug: query.categorySlug,
      };
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.salePrice = {
        ...(query.minPrice !== undefined && { gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
      };
    }

    if (query.playStyle || query.weight) {
      where.specification = {
        ...(query.playStyle && {
          playStyle: { contains: query.playStyle, mode: 'insensitive' },
        }),
        ...(query.weight && {
          weight: { contains: query.weight, mode: 'insensitive' },
        }),
      };
    }

    // Sắp xếp
    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: 'desc',
    };
    if (query.sortBy === SortByOption.PRICE_ASC) {
      orderBy = { salePrice: 'asc' };
    } else if (query.sortBy === SortByOption.PRICE_DESC) {
      orderBy = { salePrice: 'desc' };
    } else if (query.sortBy === SortByOption.NAME_ASC) {
      orderBy = { name: 'asc' };
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          brand: {
            select: { id: true, name: true, slug: true, logoUrl: true },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          specification: true,
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              title: true,
              price: true,
              stockQuantity: true,
              color: true,
              size: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: items,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    };
  }

  async getFeatured(limit = 10) {
    return this.prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        brand: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        specification: true,
        variants: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm hoặc sản phẩm đã ngừng kinh doanh`,
      );
    }

    return product;
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        specification: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với id ${id}`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findById(id);

    return this.prisma.$transaction(async (tx) => {
      let slug: string | undefined = undefined;
      if (dto.slug) {
        slug = slugify(dto.slug);
      } else if (dto.name) {
        slug = slugify(dto.name);
      }

      if (slug) {
        const existing = await tx.product.findFirst({
          where: { slug, NOT: { id } },
        });
        if (existing) {
          throw new ConflictException(`Slug '${slug}' đã được sử dụng`);
        }
      }

      // Cập nhật thông tin cơ bản
      const updated = await tx.product.update({
        where: { id },
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          originalPrice: dto.originalPrice,
          salePrice: dto.salePrice,
          categoryId: dto.categoryId,
          brandId: dto.brandId,
          isFeatured: dto.isFeatured,
          isActive: dto.isActive,
          tags: dto.tags,
        },
      });

      // Cập nhật Specification nếu có
      if (dto.specification) {
        await tx.productSpecification.upsert({
          where: { productId: id },
          create: {
            productId: id,
            ...dto.specification,
          },
          update: {
            ...dto.specification,
          },
        });
      }

      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          images: { orderBy: { displayOrder: 'asc' } },
          specification: true,
          variants: true,
        },
      });
    });
  }

  async remove(id: number) {
    await this.findById(id);
    // Soft delete để bảo toàn lịch sử đơn hàng
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateVariantStock(variantId: number, stockQuantity: number) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException(
        `Không tìm thấy biến thể sản phẩm với id ${variantId}`,
      );
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity },
    });
  }
}
