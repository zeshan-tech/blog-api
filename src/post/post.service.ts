import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';
import { Post } from './schema/post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(input: CreatePostInputDto, userId: string): Promise<IdOutput> {
    const post: Partial<Post> = {
      title: input.Title,
      content: input.Content,
      user: userId,
    };

    const createdPost = await this.postModel.create(post);

    return { _id: createdPost._id.toString() };
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return this.postModel.find({ user: userId });
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postModel.find();

    return posts;
  }

  async getPostById(_id: string): Promise<Post> {
    const post = await this.postModel.findOne({ _id });
    if (!post) {
      throw new NotFoundException('Invalid post specified');
    }

    return post;
  }

  async deletePost(postId: string, userId: string): Promise<SuccessOutput> {
    const deletedPost = await this.postModel.findOneAndDelete({ _id: postId, user: userId });

    if (!deletedPost) {
      throw new NotFoundException('Invalid post specified');
    }

    return { isSuccess: true };
  }

  async updatePost(input: UpdatePostInputDto, postId: string, userId: string): Promise<SuccessOutput> {
    let contentFileId: string;
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Invalid post specified');
    }
    await this.postModel.findOneAndUpdate({ _id: postId, user: userId, ...(input.Content ? { contentFileId } : null) }, input);

    return { isSuccess: true };
  }
}
