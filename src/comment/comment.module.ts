import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './schema/comment.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
