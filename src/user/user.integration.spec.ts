import { TestServer } from '../test/test.server';
import user from '../test/data/user';
import { UserModule } from '../user/user.module';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('PostController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  beforeAll(async () => {
    await server.setup([UserModule]);
    await server.authManager.insertUser();
    token = await server.authManager.generateToken();
    console.log(token);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    await server.insertTestData(userModel, user);
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should register a user', async () => {
    console.log('Registrations of users');
  }, 100000);
});
