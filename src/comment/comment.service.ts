import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { Model, Types } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {}

  async createComment(input: CreateCommentInputDto, userId: string): Promise<IdOutput> {
    const comment: Partial<Comment> = {
      text: input.Text,
      user: userId,
      post: input.PostId,
      parentComment: input.CommentId,
    };

    const createdComment = await this.commentModel.create(comment);

    return { _id: createdComment._id.toString() };
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ post: new Types.ObjectId(postId) as any });
  }
  async getReplies(_id: string): Promise<Comment[]> {
    return this.commentModel.find({ parentComment: _id });
  }

  async deleteComment(commentId: string, userId: string): Promise<SuccessOutput> {
    const deletedComment = await this.commentModel.findOneAndDelete({ _id: commentId, user: userId });

    if (!deletedComment) {
      throw new NotFoundException('Invalid comment specified');
    }

    return { isSuccess: true };
  }

  async updateComment(input: UpdateCommentInputDto, commentId: string, userId: string): Promise<SuccessOutput> {
    await this.commentModel.findOneAndUpdate({ _id: commentId, user: userId }, { text: input.Text });

    return { isSuccess: true };
  }
}
