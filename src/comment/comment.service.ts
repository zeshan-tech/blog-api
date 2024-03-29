import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import { Model, Types } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>, private readonly postService: PostService) {}

  async createComment(input: CreateCommentInputDto, userId: string): Promise<IdOutput> {
    await this.postService.getPostById(input.PostId);

    if (input.CommentId) {
      await this.getCommentById(input.CommentId);
    }

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

  async getCommentById(_id: string): Promise<Comment> {
    const comment = await this.commentModel.findById({ _id });
    if (!comment) {
      throw new NotFoundException('Invalid comment specified');
    }

    return comment;
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
    const updatedComment = await this.commentModel.findOneAndUpdate({ _id: commentId, user: userId }, { text: input.Text });
    if (!updatedComment) {
      throw new NotFoundException('Invalid comment specified');
    }

    return { isSuccess: true };
  }
}
