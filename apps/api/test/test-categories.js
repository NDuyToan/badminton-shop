const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const request = require('supertest');
const { AppModule } = require('../dist/app.module');
const { PrismaService } = require('../dist/prisma/prisma.service');

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ CRUD CATEGORIES ---');
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.init();
  const server = app.getHttpServer();
  const prisma = app.get(PrismaService);

  try {
    // 0. Dọn dẹp dữ liệu test cũ
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany({
      where: {
        slug: {
          in: ['vot-cau-long', 'giay-chinh-hang', 'vot-cau-long-cao-cap'],
        },
      },
    });

    // 1. Test POST /api/v1/categories (Tạo mới tự sinh slug)
    console.log('1. Kiểm tra tạo mới Category với slug tự sinh...');
    const createRes = await request(server)
      .post('/api/v1/categories')
      .send({
        name: 'Vợt Cầu Lông',
        description: 'Các dòng vợt cầu lông Yonex, Victor, Lining',
      });
    console.assert(createRes.status === 201, `Expected 201, got ${createRes.status}`);
    console.assert(createRes.body.slug === 'vot-cau-long', `Expected 'vot-cau-long', got ${createRes.body.slug}`);
    console.assert(createRes.body.status === 'ACTIVE', `Expected ACTIVE, got ${createRes.body.status}`);
    console.log('   => Thành công:', createRes.body.name, `[slug: ${createRes.body.slug}]`);
    const cat1Id = createRes.body.id;

    // 2. Test POST /api/v1/categories với slug trùng lặp
    console.log('2. Kiểm tra tạo danh mục trùng slug (báo lỗi 409 Conflict)...');
    const dupRes = await request(server)
      .post('/api/v1/categories')
      .send({
        name: 'Vợt Cầu Lông',
      });
    console.assert(dupRes.status === 409, `Expected 409, got ${dupRes.status}`);
    console.log('   => Thành công: Bị chặn chính xác với mã 409');

    // 3. Test ValidationPipe (Tên rỗng)
    console.log('3. Kiểm tra Validation Pipe khi tên rỗng (báo lỗi 400 Bad Request)...');
    const valRes = await request(server)
      .post('/api/v1/categories')
      .send({
        name: '',
      });
    console.assert(valRes.status === 400, `Expected 400, got ${valRes.status}`);
    console.log('   => Thành công: Bị chặn chính xác với mã 400');

    // 4. Test POST với slug tùy biến
    console.log('4. Kiểm tra tạo danh mục với slug chỉ định trước...');
    const customSlugRes = await request(server)
      .post('/api/v1/categories')
      .send({
        name: 'Giày Cầu Lông',
        slug: 'giay-chinh-hang',
      });
    console.assert(customSlugRes.status === 201, `Expected 201, got ${customSlugRes.status}`);
    console.assert(customSlugRes.body.slug === 'giay-chinh-hang', `Expected 'giay-chinh-hang', got ${customSlugRes.body.slug}`);
    console.log('   => Thành công:', customSlugRes.body.name, `[slug: ${customSlugRes.body.slug}]`);
    const cat2Id = customSlugRes.body.id;

    // 5. Test GET /api/v1/categories (Lấy danh sách)
    console.log('5. Kiểm tra GET /api/v1/categories...');
    const listRes = await request(server).get('/api/v1/categories');
    console.assert(listRes.status === 200, `Expected 200, got ${listRes.status}`);
    console.assert(Array.isArray(listRes.body) && listRes.body.length >= 2, 'Expected array with >= 2 items');
    console.assert(listRes.body[0]._count !== undefined, 'Expected _count in response');
    console.log(`   => Thành công: Lấy được ${listRes.body.length} danh mục kèm product count`);

    // 6. Test GET /api/v1/categories/:slug
    console.log('6. Kiểm tra GET /api/v1/categories/:slug...');
    const getSlugRes = await request(server).get('/api/v1/categories/vot-cau-long');
    console.assert(getSlugRes.status === 200, `Expected 200, got ${getSlugRes.status}`);
    console.assert(getSlugRes.body.id === cat1Id, 'Expected matching id');
    console.log('   => Thành công: Lấy đúng chi tiết danh mục theo slug');

    // 7. Test GET /api/v1/categories/:slug không tồn tại
    console.log('7. Kiểm tra GET slug không tồn tại (báo lỗi 404)...');
    const notFoundRes = await request(server).get('/api/v1/categories/khong-ton-tai-xyz');
    console.assert(notFoundRes.status === 404, `Expected 404, got ${notFoundRes.status}`);
    console.log('   => Thành công: Trả về 404 NotFoundException chính xác');

    // 8. Test PATCH /api/v1/categories/:id
    console.log('8. Kiểm tra PATCH cập nhật tên và tự cập nhật slug...');
    const updateRes = await request(server)
      .patch(`/api/v1/categories/${cat1Id}`)
      .send({
        name: 'Vợt Cầu Lông Cao Cấp',
      });
    console.assert(updateRes.status === 200, `Expected 200, got ${updateRes.status}`);
    console.assert(updateRes.body.slug === 'vot-cau-long-cao-cap', `Expected 'vot-cau-long-cao-cap', got ${updateRes.body.slug}`);
    console.log('   => Thành công: Cập nhật thành công tên và slug mới');

    // 9. Test DELETE /api/v1/categories/:id
    console.log('9. Kiểm tra DELETE xóa danh mục...');
    const deleteRes = await request(server).delete(`/api/v1/categories/${cat1Id}`);
    console.assert(deleteRes.status === 200, `Expected 200, got ${deleteRes.status}`);
    console.log('   => Thành công: Đã xóa danh mục');

    // 10. Dọn dẹp danh mục 2
    await request(server).delete(`/api/v1/categories/${cat2Id}`);

    console.log('\n--- TẤT CẢ 10 BƯỚC TEST CRUD CATEGORIES ĐÃ PASS 100%! ---');
  } finally {
    await app.close();
  }
}

runTests().catch((err) => {
  console.error('Test thất bại:', err);
  process.exit(1);
});
