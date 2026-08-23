import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdCategoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    // Cleanup any existing test categories
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany({
      where: {
        slug: {
          in: ['vot-cau-long-e2e', 'giay-cau-long-e2e', 'vot-cau-long-e2e-updated'],
        },
      },
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.category.deleteMany({
      where: {
        slug: {
          in: ['vot-cau-long-e2e', 'giay-cau-long-e2e', 'vot-cau-long-e2e-updated'],
        },
      },
    });
    await app.close();
  });

  it('POST /api/v1/categories - should create a new category with auto-generated slug', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({
        name: 'Vợt Cầu Lông E2E',
        description: 'Mô tả danh mục test E2E',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Vợt Cầu Lông E2E');
    expect(res.body.slug).toBe('vot-cau-long-e2e');
    expect(res.body.status).toBe('ACTIVE');

    createdCategoryId = res.body.id;
  });

  it('POST /api/v1/categories - should fail when creating with duplicate slug', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({
        name: 'Vợt Cầu Lông E2E',
      })
      .expect(409);
  });

  it('POST /api/v1/categories - should fail on validation error (empty name)', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/categories')
      .send({
        name: '',
      })
      .expect(400);
  });

  it('GET /api/v1/categories - should return list of categories', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((c: any) => c.id === createdCategoryId);
    expect(found).toBeDefined();
    expect(found._count).toBeDefined();
  });

  it('GET /api/v1/categories/:slug - should return category by slug', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/categories/vot-cau-long-e2e')
      .expect(200);

    expect(res.body.id).toBe(createdCategoryId);
    expect(res.body.name).toBe('Vợt Cầu Lông E2E');
  });

  it('GET /api/v1/categories/:slug - should return 404 for non-existent slug', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/categories/non-existent-slug-xyz')
      .expect(404);
  });

  it('PATCH /api/v1/categories/:id - should update category', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/categories/${createdCategoryId}`)
      .send({
        name: 'Vợt Cầu Lông E2E Updated',
        description: 'Mô tả cập nhật',
      })
      .expect(200);

    expect(res.body.name).toBe('Vợt Cầu Lông E2E Updated');
    expect(res.body.slug).toBe('vot-cau-long-e2e-updated');
  });

  it('DELETE /api/v1/categories/:id - should delete category', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/categories/${createdCategoryId}`)
      .expect(200);

    // Verify it is gone
    await request(app.getHttpServer())
      .get('/api/v1/categories/vot-cau-long-e2e-updated')
      .expect(404);
  });
});
