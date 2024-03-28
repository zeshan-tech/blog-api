import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { Comment } from './schema/comment.schema';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';

describe('CommentService', () => {
  let service: CommentService;
  let commentMock: Partial<Comment>;
  let mockCommentModel: Model<Comment>;

  beforeEach(async () => {
    commentMock = {
      _id: new Types.ObjectId(),
      text: 'Test comment',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    mockCommentModel = module.get<Model<Comment>>(getModelToken(Comment.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCommentsByPostId', () => {
    it('should get comments by post _id', async () => {
      const postId = '100';

      jest.spyOn(mockCommentModel, 'find').mockResolvedValue([commentMock] as any);

      const result = await service.getCommentsByPostId(postId);

      // Assertion
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].text).toEqual(commentMock.text);
    });

    it('should throw an error if error to retrieve comments by post _id', async () => {
      const postId = '100';
      jest.spyOn(mockCommentModel, 'find').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(service.getCommentsByPostId(postId)).rejects.toThrow();
    });
  });

  describe('getReplies', () => {
    it('should get comment replies', async () => {
      const postId = '100';

      jest.spyOn(mockCommentModel, 'find').mockResolvedValue([commentMock] as any);

      const result = await service.getReplies(postId);

      // Assertion
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].text).toEqual(commentMock.text);
    });

    it('should throw an error if error to get comment replies', async () => {
      const postId = '100';
      jest.spyOn(mockCommentModel, 'find').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(service.getReplies(postId)).rejects.toThrow();
    });
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const userId = '100';
      const input: CreateCommentInputDto = {
        Text: 'Test comment',
        PostId: '100',
        CommentId: '99',
      };

      jest.spyOn(mockCommentModel, 'create').mockImplementationOnce(() => Promise.resolve(commentMock as any));

      const result = await service.createComment(input, userId);

      // Assertion
      expect(result && typeof result === 'object').toBe(true);
      expect(result._id).toEqual(commentMock._id.toString());
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const commentId = '100';
      const userId = '100';

      jest.spyOn(mockCommentModel, 'findOneAndDelete').mockResolvedValue(commentMock as any);

      const result = await service.deleteComment(commentId, userId);

      // Assertion
      expect(result.isSuccess).toBe(true);
    });

    it('should throw an error if fails to delete comment', async () => {
      const userId = '100';
      const commentId = '100';
      jest.spyOn(mockCommentModel, 'findOneAndDelete').mockRejectedValueOnce(new Error());

      await expect(service.deleteComment(commentId, userId)).rejects.toThrow();
      expect(mockCommentModel.findOneAndDelete).toHaveBeenCalledWith({ _id: commentId, user: userId });
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const commentId = '100';
      const userId = '100';
      const input: UpdateCommentInputDto = {
        Text: 'Test comment',
      };

      jest.spyOn(mockCommentModel, 'findOneAndUpdate').mockResolvedValue(commentMock as any);

      const result = await service.updateComment(input, commentId, userId);

      // Assertion
      expect(result.isSuccess).toBe(true);
    });

    it('should throw an error if error to update a comment', async () => {
      // Arrange
      const commentId = '100';
      const userId = 'user_id';
      const input: UpdateCommentInputDto = {
        Text: 'Test comment',
      };

      jest.spyOn(mockCommentModel, 'findOneAndUpdate').mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(service.updateComment(input, commentId, userId)).rejects.toThrow();
    });
  });
});
