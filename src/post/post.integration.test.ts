import { TestServer } from '../test/test.server';
import { PostModule } from './post.module';
import user from '../test/data/user';
import post from '../test/data/post';
import { UserModule } from '../user/user.module';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';

describe('PostController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  beforeAll(async () => {
    await server.setup([UserModule, PostModule]);
    const email = await server.authManager.insertUser();
    token = await server.authManager.generateToken(email);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    const postModel = server.app.get<Model<Post>>(getModelToken(Post.name));
    await server.insertTestData(userModel, user);
    await server.insertTestData(postModel, post);
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should create a post', async () => {
    console.log('Creating a post');
  }, 100000);
});
