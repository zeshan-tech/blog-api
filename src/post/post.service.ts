import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostInputDto, UpdatePostInputDto } from './dto/PostInput.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';
import { Post } from './schema/post.schema';
import { GridFsService } from './grid-fs.service';
import { GetPostOutputDto } from './dto/PostOutput.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>, private readonly gridFsService: GridFsService) {}

  async createPost(input: CreatePostInputDto, userId: string): Promise<IdOutput> {
    try {
      const contentFileId = await this.gridFsService.saveOrUpdateContent(input.Content);

      const post: Partial<Post> = {
        title: input.Title,
        contentFileId: contentFileId,
        user: userId,
      };

      const createdPost = await this.postModel.create(post);

      return { _id: createdPost._id.toString() };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllPosts(): Promise<GetPostOutputDto[]> {
    try {
      const posts = await this.postModel.find();
      const contents = await this.gridFsService.getAllContent();

      const postsWithContent: GetPostOutputDto[] = await Promise.all(
        posts.map(async (post) => {
          const content = contents.find((c) => c.id === post.contentFileId);
          post['content'] = content.content;
          return post as unknown as GetPostOutputDto;
        }),
      );

      return postsWithContent;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPostById(_id: string): Promise<GetPostOutputDto> {
    try {
      const post = await this.postModel.findOne({ _id });
      const content = await this.gridFsService.getContentById(post.contentFileId);
      post['content'] = content;

      return post as unknown as GetPostOutputDto;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deletePost(postId: string, userId: string): Promise<SuccessOutput> {
    try {
      const deletedPost = await this.postModel.findOneAndDelete({ _id: postId, user: userId });
      await this.gridFsService.deleteContentById(deletedPost.contentFileId);

      if (!deletedPost) {
        throw new NotFoundException('Invalid post specified');
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePost(input: UpdatePostInputDto, postId: string, userId: string): Promise<SuccessOutput> {
    try {
      let contentFileId: string;
      const post = await this.getPostById(postId);

      if (!post) {
        throw new NotFoundException('Invalid post specified');
      }
      if (input.Content) {
        contentFileId = await this.gridFsService.saveOrUpdateContent(input.Content, post.contentFileId);
      }

      await this.postModel.findOneAndUpdate({ _id: postId, user: userId, ...(input.Content ? { contentFileId } : null) }, input);

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }
}
