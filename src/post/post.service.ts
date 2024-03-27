import { Injectable } from '@nestjs/common';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(input: CreatePostInputDto, userId: string): Promise<IdOutput> {
    try {
      const post: Partial<Post> = {
        title: input.Title,
        content: input.Content,
        user: userId,
      };

      const createdPost = await this.postModel.create(post);

      return { _id: createdPost._id.toString() };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      return this.postModel.find();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPostById(_id: string): Promise<Post> {
    try {
      return this.postModel.findOne({ _id });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deletePost(postId: string, userId: string): Promise<SuccessOutput> {
    try {
      const deletedPost = await this.postModel.findOneAndDelete({ _id: postId, user: userId });

      if (!deletedPost) {
        throw new Error('Invalid post specified');
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePost(input: UpdatePostInputDto, postId: string, userId: string): Promise<SuccessOutput> {
    try {
      const deletedPost = await this.postModel.findOneAndUpdate({ _id: postId, user: userId }, input);

      if (!deletedPost) {
        throw new Error('Invalid post specified');
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }
}
