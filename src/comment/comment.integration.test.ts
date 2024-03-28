import { TestServer } from '../test/test.server';
import { CommentModule } from './comment.module';
import user from '../test/data/user';
import post from '../test/data/post';
import comment from '../test/data/comment';
import { UserModule } from '../user/user.module';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { UpdateCommentInputDto } from './dto/CommentInput.dto';
import * as request from 'supertest';
import { Post } from '../post/schema/post.schema';
import { PostModule } from '../post/post.module';

describe('CommentController (Integration)', () => {
  const server = new TestServer();
  let token: string;
  let currentCommentId: string;
  let currentPostId: string;

  beforeAll(async () => {
    await server.setup([UserModule, CommentModule, PostModule]);
    const email = await server.authManager.insertUser();
    token = await server.authManager.generateToken(email);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    const postModel = server.app.get<Model<Post>>(getModelToken(Post.name));
    const commentModel = server.app.get<Model<Comment>>(getModelToken(Comment.name));
    await server.insertTestData(userModel, user);
    const createdPost = await server.insertTestData(postModel, post);
    currentPostId = createdPost[0]._id.toString();

    await server.insertTestData(commentModel, comment);
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  it('should create a comment', async () => {
    const input = {
      Text: 'test comment',
      PostId: currentPostId,
    };
    const response = await request(server.httpServer).post('/comment').set({ Authorization: token }).send(input);

    currentCommentId = response.body['_id'];

    expect(response.body).toBeDefined();
    expect(typeof response.body['_id']).toBe('string');
  }, 100000);

  it('should update a comment', async () => {
    const input: UpdateCommentInputDto = {
      Text: 'test comment',
    };
    const response = await request(server.httpServer).put(`/comment/${currentCommentId}`).set({ Authorization: token }).send(input);

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);

  it('should get comments by post id', async () => {
    const response = await request(server.httpServer).get(`/comment/${currentPostId}`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body[0]['text']).toBe('string');
  }, 100000);

  it('should get comments by post id', async () => {
    const response = await request(server.httpServer).get(`/comment/replies/${currentCommentId}`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  }, 100000);

  it('should delete comment', async () => {
    const response = await request(server.httpServer).delete(`/comment/${currentCommentId}`).set({ Authorization: token }).send();

    expect(response.body).toBeDefined();
    expect(typeof response.body['isSuccess']).toBe('boolean');
  }, 100000);
});
