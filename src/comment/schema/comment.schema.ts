import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from '../../post/schema/post.schema';
import { User } from '../../user/schema/user.schema';
import { BaseSchema } from '../../base/base.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment extends BaseSchema {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parentComment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
