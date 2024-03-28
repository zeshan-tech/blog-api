import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { Post } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';

describe('PostService', () => {
  let service: PostService;
  let postMock: Partial<Post>;
  let mockPostModel: Model<Post>;

  beforeEach(async () => {
    postMock = {
      _id: new Types.ObjectId(),
      title: 'Test title',
      content: Buffer.from('contentFileId', 'utf-8'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(Post.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    mockPostModel = module.get<Model<Post>>(getModelToken(Post.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // DONE
  describe('getAllPosts', () => {
    it('should throw an error if database fails to retrieve posts', async () => {
      jest.spyOn(mockPostModel, 'find').mockRejectedValueOnce(new Error('Database connection error'));

      await expect(service.getAllPosts()).rejects.toThrow();
    });

    it('should get all posts', async () => {
      jest.spyOn(mockPostModel, 'find').mockResolvedValue([postMock] as any);

      const result = await service.getAllPosts();

      // Assertion
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].title).toEqual(postMock.title);
    });
  });

  // DONE
  describe('getPostById', () => {
    it('should throw an error if database fails to retrieve posts', async () => {
      jest.spyOn(mockPostModel, 'find').mockRejectedValueOnce(new Error('Database connection error'));

      await expect(service.getAllPosts()).rejects.toThrow();
    });

    it('should get post by _id', async () => {
      const postId = '100';

      jest.spyOn(mockPostModel, 'findOne').mockResolvedValue(postMock as any);

      const result = await service.getPostById(postId);

      // Assertion
      expect(result.title).toEqual(postMock.title);
    });
  });

  // DONE
  describe('createPost', () => {
    it('should throw an error if title or content is missing', async () => {
      const userId = '100';
      const input = {} as CreatePostInputDto;

      await expect(service.createPost(input, userId)).rejects.toThrow();
    });

    it('should create a post', async () => {
      const userId = '100';
      const input: CreatePostInputDto = {
        Title: 'Test post',
        Content: Buffer.from('Test content', 'utf-8'),
      };

      jest.spyOn(mockPostModel, 'create').mockImplementationOnce(() => Promise.resolve(postMock as any));

      const result = await service.createPost(input, userId);

      // Assertion
      expect(result && typeof result === 'object').toBe(true);
      expect(result._id).toEqual(postMock._id.toString());
    });
  });

  // DONE
  describe('deletePost', () => {
    it('should throw an Error if an invalid post ID is provided', async () => {
      const invalidPostId = 'invalid_id';
      const userId = '100';

      await expect(service.deletePost(invalidPostId, userId)).rejects.toThrow();
    });

    it('should delete a post', async () => {
      const postId = '100';
      const userId = '100';

      jest.spyOn(mockPostModel, 'findOneAndDelete').mockResolvedValue(postMock as any);

      const result = await service.deletePost(postId, userId);

      // Assertion
      expect(result.isSuccess).toBe(true);
    });
  });

  // DONE
  describe('updatePost', () => {
    it('should throw an error if database fails to update a post', async () => {
      const postId = '100';
      const userId = 'user_id';
      const input: UpdatePostInputDto = {
        Title: 'Test post',
        Content: Buffer.from('Test content', 'utf-8'),
      };

      jest.spyOn(mockPostModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Database connection error'));

      await expect(service.updatePost(input, postId, userId)).rejects.toThrow();
    });

    it('should update a post', async () => {
      const postId = postMock._id.toString();
      const userId = 'user_id';
      const input: UpdatePostInputDto = {
        Title: 'Test post',
        Content: Buffer.from('Test content', 'utf-8'),
      };

      jest.spyOn(mockPostModel, 'findById').mockResolvedValue(postMock);
      jest.spyOn(mockPostModel, 'findOneAndUpdate').mockResolvedValue(postMock);

      const result = await service.updatePost(input, postId, userId);

      expect(result.isSuccess).toBe(true);
    });
  });
});
