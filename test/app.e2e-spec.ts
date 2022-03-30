import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from './../src/app.module';
import { CreateEmployeeDto } from 'src/module/employee/dto/create-employee.dto';
import { generateRandomEmail } from './utils/randomGenerator';
import { SignInDto } from 'src/module/employee/dto/sign-in.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/employee/signup (POST) - Create new employee', () => {
    const payload: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: generateRandomEmail(),
      password: 'Test!232344',
    };
    return request(app.getHttpServer())
      .post('/employee/signup')
      .send(payload)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
      });
  });

  it('/employee/signup (POST) - Create new employee should fail', () => {
    const payload: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: generateRandomEmail(),
      password: '1234',
    };
    return request(app.getHttpServer())
      .post('/employee/signup')
      .send(payload)
      .expect(400);
  });

  it('/employee/login (POST) - Login successfully', async () => {
    const email = generateRandomEmail();
    const payloadSignup: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      password: 'Test!23',
    };
    const payloadLogin: SignInDto = {
      email: email,
      password: 'Test!23',
    };
    await request(app.getHttpServer())
      .post('/employee/signup')
      .send(payloadSignup)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
      });
    return await request(app.getHttpServer())
      .post('/employee/login')
      .send(payloadLogin)
      .expect(200);
  });

  it('/employee/login (POST) - Login should fail', async () => {
    const email = generateRandomEmail();
    const payloadSignup: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      password: 'Test!23',
    };
    const payloadLogin: SignInDto = {
      email: email,
      password: 'wrongPassword',
    };
    await request(app.getHttpServer())
      .post('/employee/signup')
      .send(payloadSignup)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
      });
    return await request(app.getHttpServer())
      .post('/employee/login')
      .send(payloadLogin)
      .expect(400);
  });

  it('/customers/all-tracks (GET) - It should return all tracks', async () => {
    const email = generateRandomEmail();
    const payloadSignup: CreateEmployeeDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      password: 'Test!23',
    };
    let token = '';
    await request(app.getHttpServer())
      .post('/employee/signup')
      .send(payloadSignup)
      .expect(201)
      .expect((response) => {
        expect(response.body.accessToken).toBeDefined();
        token = response.body.accessToken;
      });
    return await request(app.getHttpServer())
      .get('/customers/all-tracks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/customers/all-tracks (GET) - It should not return all tracks', async () => {
    return await request(app.getHttpServer())
      .get('/customers/all-tracks')
      .expect(401);
  });
});
