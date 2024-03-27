import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';
import { CreatePostInputDto } from './dto/PostInput.dto';
import { CurrentUser } from '../decorator/current-user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() input: CreatePostInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.postService.createPost(input, currentUser._id);
  }

  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':_id')
  async getPostById(@Param('_id') _id: string) {
    return this.postService.getPostById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deletePost(@Param('_id') _id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.postService.deletePost(_id, currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':_id')
  async updatePost(@Param('_id') _id: string, @Body() input: CreatePostInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.postService.updatePost(input, _id, currentUser._id);
  }
}
