import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../dist/src/generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Đang bắt đầu Seeding dữ liệu Li-Ning Badminton Shop ---');

  // 1. Seed Brands
  const brandLining = await prisma.brand.upsert({
    where: { slug: 'li-ning' },
    update: {},
    create: {
      name: 'Li-Ning',
      slug: 'li-ning',
      logoUrl: 'https://theme.hstatic.net/200000099191/1001041918/14/logo.png',
      description: 'Thương hiệu thể thao hàng đầu thế giới trong bộ môn cầu lông.',
    },
  });

  const brandYonex = await prisma.brand.upsert({
    where: { slug: 'yonex' },
    update: {},
    create: {
      name: 'Yonex',
      slug: 'yonex',
      description: 'Thương hiệu cầu lông Nhật Bản.',
    },
  });

  console.log('✓ Seeded Brands');

  // 2. Seed Categories
  const catRackets = await prisma.category.upsert({
    where: { slug: 'vot-cau-long' },
    update: {},
    create: {
      name: 'Vợt Cầu Lông',
      slug: 'vot-cau-long',
      description: 'Các dòng vợt cầu lông Li-Ning cao cấp và phong trào.',
      displayOrder: 1,
      isFeatured: true,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'axforce' },
    update: { parentId: catRackets.id },
    create: {
      name: 'AXFORCE',
      slug: 'axforce',
      parentId: catRackets.id,
      displayOrder: 1,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'halbertec' },
    update: { parentId: catRackets.id },
    create: {
      name: 'HALBERTEC',
      slug: 'halbertec',
      parentId: catRackets.id,
      displayOrder: 2,
    },
  });

  await prisma.category.upsert({
    where: { slug: 'calibar' },
    update: { parentId: catRackets.id },
    create: {
      name: 'CALIBAR',
      slug: 'calibar',
      parentId: catRackets.id,
      displayOrder: 3,
    },
  });

  const catShoes = await prisma.category.upsert({
    where: { slug: 'giay-cau-long' },
    update: {},
    create: {
      name: 'Giày Cầu Lông',
      slug: 'giay-cau-long',
      description: 'Giày cầu lông êm ái, bám sân, chống lật cổ chân.',
      displayOrder: 2,
      isFeatured: true,
    },
  });

  const catApparel = await prisma.category.upsert({
    where: { slug: 'trang-phuc' },
    update: {},
    create: {
      name: 'Trang Phục',
      slug: 'trang-phuc',
      description: 'Áo, quần, bộ thi đấu cầu lông thoáng khí thấm mồ hôi.',
      displayOrder: 3,
      isFeatured: true,
    },
  });

  const catAccessories = await prisma.category.upsert({
    where: { slug: 'phu-kien' },
    update: {},
    create: {
      name: 'Phụ Kiện Cầu Lông',
      slug: 'phu-kien',
      description: 'Túi đựng vợt, balo, quấn cán, cước đan và quả cầu lông.',
      displayOrder: 4,
      isFeatured: true,
    },
  });

  console.log('✓ Seeded Categories');

  // 3. Seed Products
  // Product 1: Vợt 3D Calibar 200
  const productCalibar200 = await prisma.product.upsert({
    where: { slug: 'vot-cau-long-3d-calibar-200' },
    update: {},
    create: {
      name: 'Vợt Cầu Lông 3D Calibar 200 AYPM394-4',
      slug: 'vot-cau-long-3d-calibar-200',
      description:
        'Vợt cầu lông 3D CALIBAR 200 được xây dựng trên Nền tảng Công nghệ 3D Calibar hình học giảm đáng kể sức cản không khí, phù hợp với lối đánh cân bằng công thủ toàn diện.',
      originalPrice: 1423636,
      salePrice: 996545,
      categoryId: catRackets.id,
      brandId: brandLining.id,
      isFeatured: true,
      tags: ['calibar', 'vot-cau-long', 'cong-thu-toan-dien'],
      specification: {
        create: {
          weight: '4U (83±3g)',
          gripSize: 'S2/G5',
          balancePoint: 296,
          stiffness: 'Dẻo',
          maxTension: '11.5kg / 26-28 lbs',
          frameMaterial: 'Carbon Fiber',
          shaftMaterial: 'Carbon Fiber + UHB Shaft',
          playStyle: 'Công thủ toàn diện',
          origin: 'Trung Quốc',
        },
      },
      images: {
        create: [
          {
            url: 'https://cdn.hstatic.net/products/200000099191/9c93_dab539b0d3c24967b4e5a1bfef3dffb2_741a87f25b0f481cb5ab5983b5f03d48_54d5c617a64c43afb710d6389dfbce91.jpg',
            altText: 'Vợt 3D Calibar 200 mặt trước',
            isThumbnail: true,
            displayOrder: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'P-AYPM394-4NO',
            title: '4U/G5 - Xanh Vàng',
            price: 996545,
            originalPrice: 1423636,
            stockQuantity: 20,
            color: 'Xanh Vàng',
            size: '4U',
          },
        ],
      },
    },
  });

  // Product 2: Vợt Axforce 80
  const productAxforce80 = await prisma.product.upsert({
    where: { slug: 'vot-cau-long-axforce-80' },
    update: {},
    create: {
      name: 'Vợt Cầu Lông Li-Ning Axforce 80 Chen Long',
      slug: 'vot-cau-long-axforce-80',
      description:
        'Cây vợt biểu tượng của nhà vô địch Chen Long với công nghệ vật liệu Superb Carbon, trợ lực tối đa cho những cú đập cầu cắm sân uy lực.',
      originalPrice: 4500000,
      salePrice: 3850000,
      categoryId: catRackets.id,
      brandId: brandLining.id,
      isFeatured: true,
      tags: ['axforce', 'chen-long', 'thien-cong'],
      specification: {
        create: {
          weight: '4U (83g) / 3U (88g)',
          gripSize: 'G5',
          balancePoint: 302,
          stiffness: 'Cứng',
          maxTension: '30 lbs / 13.5 kg',
          frameMaterial: 'Superb Carbon + TB NANO',
          shaftMaterial: 'UHB SHAFT 6.6mm',
          playStyle: 'Thiên công',
          origin: 'Trung Quốc',
        },
      },
      images: {
        create: [
          {
            url: 'https://cdn.hstatic.net/products/200000099191/axforce_80_black.jpg',
            altText: 'Vợt Axforce 80 Chen Long',
            isThumbnail: true,
            displayOrder: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'AX80-4UG5',
            title: '4U/G5 - Đen Nhám',
            price: 3850000,
            originalPrice: 4500000,
            stockQuantity: 15,
            color: 'Đen',
            size: '4U',
          },
          {
            sku: 'AX80-3UG5',
            title: '3U/G5 - Đen Nhám',
            price: 3850000,
            originalPrice: 4500000,
            stockQuantity: 8,
            color: 'Đen',
            size: '3U',
          },
        ],
      },
    },
  });

  // Product 3: Giày Halberd ZJ
  const productShoes = await prisma.product.upsert({
    where: { slug: 'giay-cau-long-halberd-zj' },
    update: {},
    create: {
      name: 'Giày Cầu Lông Li-Ning Halberd ZJ Professional',
      slug: 'giay-cau-long-halberd-zj',
      description:
        'Dòng giày thi đấu chuyên nghiệp với đệm BOOM siêu êm, giảm chấn tối đa cho gót chân khi bật nhảy đập cầu.',
      originalPrice: 2800000,
      salePrice: 2150000,
      categoryId: catShoes.id,
      brandId: brandLining.id,
      isFeatured: true,
      tags: ['giay-cau-long', 'halberd-zj', 'boom'],
      specification: {
        create: {
          shoeSize: '39 - 44',
          shoeUpper: 'Synthetic Leather + TPU + Textile',
          shoeSole: 'Cao su bám sân Rubber + Đệm Li-Ning BOOM',
          playStyle: 'Thiên công',
          origin: 'Trung Quốc',
        },
      },
      images: {
        create: [
          {
            url: 'https://cdn.hstatic.net/products/200000099191/halberd_zj_shoe.jpg',
            altText: 'Giày Halberd ZJ',
            isThumbnail: true,
            displayOrder: 0,
          },
        ],
      },
      variants: {
        create: [
          {
            sku: 'HBZJ-WHITE-40',
            title: 'Size 40 - Trắng Đỏ',
            price: 2150000,
            originalPrice: 2800000,
            stockQuantity: 6,
            color: 'Trắng Đỏ',
            size: '40',
          },
          {
            sku: 'HBZJ-WHITE-41',
            title: 'Size 41 - Trắng Đỏ',
            price: 2150000,
            originalPrice: 2800000,
            stockQuantity: 10,
            color: 'Trắng Đỏ',
            size: '41',
          },
          {
            sku: 'HBZJ-WHITE-42',
            title: 'Size 42 - Trắng Đỏ',
            price: 2150000,
            originalPrice: 2800000,
            stockQuantity: 12,
            color: 'Trắng Đỏ',
            size: '42',
          },
        ],
      },
    },
  });

  console.log('✓ Seeded Products & Variants');

  // 4. Seed Banners
  await prisma.banner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'BST Chiharu Shida Collection 2026',
      imageUrl: '//theme.hstatic.net/200000099191/1001041918/14/slider_1_image.png?v=517',
      linkUrl: '/collections/shida',
      position: 'HERO_SLIDER',
      displayOrder: 1,
      isActive: true,
    },
  });

  await prisma.banner.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Voucher Độc Quyền Online Giảm 30%',
      imageUrl: '//theme.hstatic.net/200000099191/1001041918/14/slider_2_image.png?v=517',
      linkUrl: '/collections/voucher-only-online',
      position: 'HERO_SLIDER',
      displayOrder: 2,
      isActive: true,
    },
  });

  console.log('✓ Seeded Banners');

  // 5. Seed News/Blog
  await prisma.post.upsert({
    where: { slug: 'khi-chiharu-shida-tro-thanh-cam-hung-cho-bo-suu-tap-li-ning' },
    update: {},
    create: {
      title: 'KHI CHIHARU SHIDA TRỞ THÀNH CẢM HỨNG CHO BỘ SƯU TẬP LI-NING',
      slug: 'khi-chiharu-shida-tro-thanh-cam-hung-cho-bo-suu-tap-li-ning',
      summary:
        'Chiharu Shida vốn được biết đến là một trong những tay vợt cầu lông hàng đầu thế giới với lối chơi tốc độ, sự bền bỉ và nguồn năng lượng mạnh mẽ trên sân đấu.',
      content:
        '<p>Chiharu Shida là biểu tượng của tinh thần chiến đấu quả cảm và phong cách thời trang thể thao thanh lịch. Bộ sưu tập mới của Li-Ning kết hợp giữa hiệu năng thi đấu đỉnh cao và màu sắc trẻ trung, hiện đại.</p>',
      thumbnail:
        'https://cdn.hstatic.net/files/200000099191/article/pk_bst_16x9_copy_6c29cabfa660473590752de42f27536d_grande.jpg',
      category: 'TIN_TUC',
      isPublished: true,
    },
  });

  console.log('✓ Seeded News & Posts');
  console.log('--- Hoàn tất Seeding thành công! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
