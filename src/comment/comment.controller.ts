import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';
import { CreateCommentInputDto, UpdateCommentInputDto } from './dto/CommentInput.dto';
import { CurrentUser } from '../decorator/current-user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body() input: CreateCommentInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.commentService.createComment(input, currentUser._id);
  }

  @Get(':postId')
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @Get('replies/:_id')
  async getReplies(@Param('_id') _id: string) {
    return this.commentService.getReplies(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':_id')
  async deleteComment(@Param('_id') _id: string, @CurrentUser() currentUser: CurrentUserType) {
    return this.commentService.deleteComment(_id, currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':_id')
  async updateComment(@Param('_id') _id: string, @Body() input: UpdateCommentInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.commentService.updateComment(input, _id, currentUser._id);
  }
}
