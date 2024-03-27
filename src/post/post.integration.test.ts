import * as request from 'supertest';
import { TestServer } from 'src/test/test.server';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from './post.module';
import * as user from '../test/data/user.json';
import * as post from '../test/data/post.json';
import { UserModule } from 'src/user/user.module';

describe('PostController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  beforeAll(async () => {
    /* await server.setup([AuthModule, PostModule]);
    token = await server.tokenManager.getIdToken();
    token = `Bearer ${token}`;

    await server.signIn(token); */

    await server.setup([UserModule, PostModule]);
    await server.insertIntoTable('users', user);
    await server.insertIntoTable('posts', post);
    token = await server.tokenManager.getIdToken();
    token = `Bearer ${token}`;

    await server.signIn(token);
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should create a post', async () => {
    // will implement the create post method
  });

  it('should create a post', async () => {
    const token = await server.signIn();
    const response = await request(server.app.getHttpServer()).post('/posts').set('Authorization', token).send({
      /* Your post data here */
    });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    // Add more assertions as needed
  });
});
