import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post, PostSchema } from './schema/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GridFsService } from './grid-fs.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService, GridFsService, CloudinaryService],
})
export class PostModule {}
