import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as request from 'supertest';
import post from '../test/data/post';
import user from '../test/data/user';
import { TestServer } from '../test/test.server';
import { User } from '../user/schema/user.schema';
import { UserModule } from '../user/user.module';
import { PostModule } from './post.module';
import { Post } from './schema/post.schema';

describe('PostController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  let currentPostId: string;

  beforeAll(async () => {
    await server.setup([UserModule, PostModule]);
    const email = await server.authManager.insertUser();
    token = await server.authManager.generateToken(email);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    await server.insertTestData(userModel, user);
    const postModel = server.app.get<Model<Post>>(getModelToken(Post.name));
    const createdPost = await server.insertTestData(postModel, post);
    currentPostId = createdPost[0]._id.toString();
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should create a post', async () => {
    const input = {
      Title: 'title',
      Content: "'Test content', 'utf-8'",
    };
    const response = await request(server.httpServer).post('/post').set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['_id']).toBe('string');
  }, 100000);

  it('should update a post', async () => {
    const input = {
      Title: 'title',
      Content: "'Test content', 'utf-8'",
    };
    const response = await request(server.httpServer).put(`/post/${currentPostId}`).set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);

  it('should get post by id', async () => {
    const response = await request(server.httpServer).get(`/post/${currentPostId}`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body['title']).toBe('string');
  }, 100000);

  it('should get all posts', async () => {
    const response = await request(server.httpServer).get(`/post`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body[0]['title']).toBe('string');
  }, 100000);

  it('should delete post', async () => {
    const response = await request(server.httpServer).delete(`/post/${currentPostId}`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);
});
