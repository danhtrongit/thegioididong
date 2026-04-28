import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public APIs', () => {
    it('GET /categories should return success', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /brands should return success', () => {
      return request(app.getHttpServer())
        .get('/brands')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
        });
    });

    it('GET /products should return paginated response', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.meta).toBeDefined();
          expect(res.body.meta.page).toBeDefined();
        });
    });

    it('GET /orders/lookup without params should return 400', () => {
      return request(app.getHttpServer())
        .get('/orders/lookup')
        .expect(400);
    });
  });

  describe('Auth', () => {
    it('POST /admin/auth/login with wrong credentials should return 401', () => {
      return request(app.getHttpServer())
        .post('/admin/auth/login')
        .send({ email: 'wrong@example.com', password: 'WrongPassword123' })
        .expect(401);
    });

    it('GET /admin/products without token should return 401', () => {
      return request(app.getHttpServer())
        .get('/admin/products')
        .expect(401);
    });
  });
});
