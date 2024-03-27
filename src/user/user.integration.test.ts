import { TestServer } from '../test/test.server';
import user from '../test/data/user';
import { UserModule } from '../user/user.module';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ChangeEmailInputDto, LoginInputDto, UpdateUserInputDto, UserRegisterInputDto } from './dto/UserInput.dto';
import { v4 as uuid } from 'uuid';
import * as request from 'supertest';

describe('PostController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  let mockEmail = '';

  beforeAll(async () => {
    await server.setup([UserModule]);
    mockEmail = `${uuid()}@example.com`;
    const email = await server.authManager.insertUser();
    token = await server.authManager.generateToken(email);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    await server.insertTestData(userModel, user);
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should register a user', async () => {
    const input: UserRegisterInputDto = {
      Email: mockEmail,
      Fullname: 'Fullname',
      Password: 'password',
    };
    const response = await request(server.httpServer).post('/user/register').set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['message']).toBe('string');
  }, 100000);

  it('should login a user', async () => {
    const input: LoginInputDto = {
      Email: mockEmail,
      Password: 'password',
    };
    const response = await request(server.httpServer).post('/user/login').set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();

    expect(typeof response.body['token']).toBe('string');
  }, 100000);

  it('should change email', async () => {
    const input: ChangeEmailInputDto = {
      NewEmail: mockEmail,
      Password: 'password',
    };
    const response = await request(server.httpServer).put('/user/change-email').set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['message']).toBe('string');
  }, 100000);

  it('should update user', async () => {
    const input: UpdateUserInputDto = {
      Fullname: 'fullname',
    };
    const response = await request(server.httpServer).put('/user/update').set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);

  it('should update user', async () => {
    const response = await request(server.httpServer).delete('/user').set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);
});
