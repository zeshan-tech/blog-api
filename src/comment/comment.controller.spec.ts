import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './schema/comment.schema';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';
import { Types } from 'mongoose';

const commentServiceMock = {
  createComment: jest.fn(),
  getCommentsByPostId: jest.fn(),
  deleteComment: jest.fn(),
  updateComment: jest.fn(),
};

describe('CommentController', () => {
  let controller: CommentController;
  let commentMock: Partial<Comment>;

  beforeEach(async () => {
    commentMock = {
      _id: new Types.ObjectId(),
      text: 'Test comment',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useValue: commentServiceMock }],
    }).compile();

    controller = module.get<CommentController>(CommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };
      const input: CreateCommentInputDto = {
        CommentId: '100',
        PostId: '100',
        Text: 'test text',
      };

      jest.spyOn(commentServiceMock, 'createComment').mockResolvedValueOnce({ _id: '100' });

      const result = await controller.createComment(input, currentUser);
      expect(result._id).toEqual('100');
    });
  });

  describe('getCommentsByPostId', () => {
    it('should get comments by post id', async () => {
      jest.spyOn(commentServiceMock, 'getCommentsByPostId').mockResolvedValue([commentMock]);

      const result = await controller.getCommentsByPostId('100');
      expect(result[0]).toEqual(commentMock);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(commentServiceMock, 'deleteComment').mockResolvedValue({ isSuccess: true });

      const result = await controller.deleteComment('100', currentUser);
      expect(result.isSuccess).toEqual(true);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const currentUser: CurrentUserType = { email: 'test@example.com', _id: '100' };
      const input: UpdateCommentInputDto = {
        Text: 'test text',
      };

      jest.spyOn(commentServiceMock, 'updateComment').mockResolvedValue({ isSuccess: true });

      const result = await controller.updateComment('100', input, currentUser);
      expect(result.isSuccess).toEqual(true);
    });
  });
});
