import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserController } from '../src/user/user.controller';
import { UserService } from '../src/user/user.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userService = {
    createUser: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should signup a new user', async () => {
    const mockResponse = 'User created successfully';
    userService.createUser.mockResolvedValue(true);

    await request(app.getHttpServer())
      .post('/user/signup')
      .send({ username: 'test', userId: '123', password: 'password' })
      .expect(201)
      .expect(mockResponse);
  });

  it('should not signup an existing user', async () => {
    userService.createUser.mockResolvedValue(false);

    await request(app.getHttpServer())
      .post('/user/signup')
      .send({ username: 'test', userId: '123', password: 'password' })
      .expect(400)
      .expect({ statusCode: 400, message: 'User already exists' });
  });

  it('should login successfully', async () => {
    const mockToken = { token: 'test_token' };
    userService.validateUser.mockResolvedValue(mockToken.token);

    await request(app.getHttpServer())
      .post('/user/login')
      .send({ userId: '123', password: 'password' })
      .expect(200)
      .expect(mockToken);
  });

  it('should not login with invalid credentials', async () => {
    userService.validateUser.mockResolvedValue(null);

    await request(app.getHttpServer())
      .post('/user/login')
      .send({ userId: '123', password: 'wrong_password' })
      .expect(401)
      .expect({ statusCode: 401, message: 'Invalid credentials' });
  });
});
