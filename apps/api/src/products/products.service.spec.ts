import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { SortByOption } from './dto/query-products.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  const mockProduct = {
    id: 1,
    name: 'Vợt Cầu Lông 3D Calibar 200',
    slug: 'vot-cau-long-3d-calibar-200',
    description: 'Vợt cầu lông cao cấp Li-Ning',
    originalPrice: 1423636,
    salePrice: 996545,
    categoryId: 1,
    brandId: 1,
    isFeatured: true,
    isActive: true,
    tags: ['vot-cau-long', 'li-ning'],
    createdAt: new Date(),
    updatedAt: new Date(),
    specification: {
      id: 1,
      productId: 1,
      weight: '4U',
      gripSize: 'S2',
      balancePoint: 296,
      stiffness: 'Dẻo',
      maxTension: '30 lbs / 13.5 kg',
      playStyle: 'Công thủ toàn diện',
    },
    images: [
      {
        id: 1,
        productId: 1,
        url: 'https://example.com/img1.jpg',
        isThumbnail: true,
        displayOrder: 0,
      },
    ],
    variants: [
      {
        id: 1,
        productId: 1,
        sku: 'P-AYPM394-4NO',
        title: '4U/G5 - Xanh Vàng',
        price: 996545,
        stockQuantity: 10,
        color: 'Xanh Vàng',
        size: '4U',
        isActive: true,
      },
    ],
  };

  beforeEach(async () => {
    prisma = {
      product: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
      brand: {
        findUnique: jest.fn(),
      },
      productSpecification: {
        create: jest.fn(),
        upsert: jest.fn(),
      },
      productImage: {
        createMany: jest.fn(),
      },
      productVariant: {
        findUnique: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Vợt Cầu Lông 3D Calibar 200',
      originalPrice: 1423636,
      salePrice: 996545,
      categoryId: 1,
      brandId: 1,
      specification: {
        weight: '4U',
        balancePoint: 296,
        playStyle: 'Công thủ toàn diện',
      },
      images: [{ url: 'https://example.com/img1.jpg', isThumbnail: true }],
      variants: [
        {
          sku: 'P-AYPM394-4NO',
          title: '4U/G5 - Xanh Vàng',
          price: 996545,
          stockQuantity: 10,
        },
      ],
    };

    it('should create a product with specs, images, and variants', async () => {
      prisma.product.findUnique
        .mockResolvedValueOnce(null) // slug check
        .mockResolvedValueOnce(mockProduct); // return created product
      prisma.category.findUnique.mockResolvedValue({ id: 1, name: 'Vợt' });
      prisma.brand.findUnique.mockResolvedValue({ id: 1, name: 'Li-Ning' });
      prisma.product.create.mockResolvedValue({ id: 1, ...createDto });

      const result = await service.create(createDto);

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.brand.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.product.create).toHaveBeenCalled();
      expect(prisma.productSpecification.create).toHaveBeenCalled();
      expect(prisma.productImage.createMany).toHaveBeenCalled();
      expect(prisma.productVariant.createMany).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should throw ConflictException if slug already exists', async () => {
      prisma.product.findUnique.mockResolvedValueOnce({ id: 99 });

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      prisma.product.findUnique.mockResolvedValueOnce(null);
      prisma.category.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated products with metadata', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        playStyle: 'Công thủ toàn diện',
        sortBy: SortByOption.PRICE_ASC,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
      });
      expect(prisma.product.findMany).toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    it('should return product by slug', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findBySlug('vot-cau-long-3d-calibar-200');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateVariantStock', () => {
    it('should update stock of a variant', async () => {
      prisma.productVariant.findUnique.mockResolvedValue({
        id: 1,
        stockQuantity: 10,
      });
      prisma.productVariant.update.mockResolvedValue({
        id: 1,
        stockQuantity: 25,
      });

      const result = await service.updateVariantStock(1, 25);
      expect(result.stockQuantity).toBe(25);
      expect(prisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { stockQuantity: 25 },
      });
    });

    it('should throw NotFoundException if variant not found', async () => {
      prisma.productVariant.findUnique.mockResolvedValue(null);

      await expect(service.updateVariantStock(999, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
