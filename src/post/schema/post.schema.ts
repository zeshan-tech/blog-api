import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../base/base.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post extends BaseSchema {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  image_url: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
