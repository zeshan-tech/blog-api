import { Injectable } from '@nestjs/common';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { Model } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async createComment(input: CreateCommentInputDto, userId: string): Promise<IdOutput> {
    try {
      const comment: Partial<Comment> = {
        text: input.Text,
        user: userId,
        post: input.PostId,
        parentComment: input.CommentId,
      };

      const createdComment = await this.commentModel.create(comment);

      return { _id: createdComment._id.toString() };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      return this.commentModel.find({ post: postId });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteComment(commentId: string, userId: string): Promise<SuccessOutput> {
    try {
      const deletedComment = await this.commentModel.findOneAndDelete({ _id: commentId, user: userId });

      if (!deletedComment) {
        throw new Error('Invalid comment specified');
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateComment(input: UpdateCommentInputDto, commentId: string, userId: string): Promise<SuccessOutput> {
    try {
      await this.commentModel.findOneAndUpdate({ _id: commentId, user: userId }, { text: input.Text });

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }
}
