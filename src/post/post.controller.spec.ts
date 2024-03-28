import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './schema/post.schema';
import { Types } from 'mongoose';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';

const postServiceMock = {
  createPost: jest.fn(),
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  deletePost: jest.fn(),
  updatePost: jest.fn(),
};

describe('PostController', () => {
  let controller: PostController;
  let postMock: Partial<Post>;

  beforeEach(async () => {
    postMock = {
      _id: new Types.ObjectId(),
      title: 'Test title',
      contentFileId: 'contentFileId',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: postServiceMock }],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const input: CreatePostInputDto = { Content: Buffer.from('Test content', 'utf-8'), Title: 'test title' };
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(postServiceMock, 'createPost').mockResolvedValueOnce({ _id: '100' });

      const result = await controller.createPost(input, currentUser);
      expect(result._id).toEqual('100');
    });
  });

  describe('getAllPosts', () => {
    it('should get all posts', async () => {
      jest.spyOn(postServiceMock, 'getAllPosts').mockResolvedValueOnce([postMock]);

      const result = await controller.getAllPosts();
      expect(result[0]._id).toEqual(postMock._id);
    });
  });

  describe('getPostById', () => {
    it('should get post by id', async () => {
      jest.spyOn(postServiceMock, 'getPostById').mockResolvedValueOnce(postMock);

      const result = await controller.getPostById('100');
      expect(result._id).toEqual(postMock._id);
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(postServiceMock, 'deletePost').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.deletePost('100', currentUser);
      expect(result.isSuccess).toEqual(true);
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const input: UpdatePostInputDto = { Content: Buffer.from('Test content', 'utf-8'), Title: 'test title' };
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(postServiceMock, 'updatePost').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.updatePost('100', input, currentUser);
      expect(result.isSuccess).toEqual(true);
    });
  });
});
