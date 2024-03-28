import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
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
  const currentPostId: string = post[0]._id.toString();

  beforeAll(async () => {
    await server.setup([UserModule, PostModule]);
    const email = await server.authManager.insertUser();
    token = await server.authManager.generateToken(email);
    const userModel = server.app.get<Model<User>>(getModelToken(User.name));
    await server.insertTestData(userModel, user);
    const postModel = server.app.get<Model<Post>>(getModelToken(Post.name));
    post[0].contentFileId = await saveContent();
    await server.insertTestData(postModel, post);
    token = `Bearer ${token}`;
  }, 100000);

  afterAll(async () => {
    await server.close();
  }, 100000);

  const saveContent = async (): Promise<string> => {
    const fileName = 'content.txt';
    const content = Buffer.from("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,", 'utf-8');
    fs.writeFileSync(fileName, content);

    const readStream = fs.createReadStream(fileName);
    const uploadStream = server.gridFSBucket.openUploadStream(`content.${uuid()}.txt`);
    readStream.pipe(uploadStream);

    const uploadedFileId = await new Promise<string>((resolve, reject) => {
      uploadStream.on('finish', () => {
        fs.unlinkSync(fileName);
        resolve(uploadStream.id.toString());
      });
      uploadStream.on('error', reject);
    });

    return uploadedFileId;
  };

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
