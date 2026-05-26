import 'reflect-metadata';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../app.module';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.APP_PIN = '1234';
    process.env.JWT_SECRET = 'test-secret';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns token with valid pin', async () => {
    await request(app.getHttpServer())
      .post('/auth/pin')
      .send({ pin: '1234' })
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.accessToken).toBe('string');
      });
  });

  it('returns 401 with invalid pin', async () => {
    await request(app.getHttpServer())
      .post('/auth/pin')
      .send({ pin: '9999' })
      .expect(401)
      .expect(({ body }) => {
        expect(body.message).toContain('PIN incorreto.');
      });
  });

  it('returns 401 on /me without token', async () => {
    await request(app.getHttpServer()).get('/me').expect(401);
  });

  it('returns 200 on /me with valid token', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/pin')
      .send({ pin: '1234' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(200)
      .expect({ authenticated: true });
  });
});
