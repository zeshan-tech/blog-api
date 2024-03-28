import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../base/base.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post extends BaseSchema {
  @Prop()
  title: string;

  @Prop({ type: Buffer })
  content: Buffer;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre('findOneAndDelete', async function (next) {
  try {
    const currentPostId = await this.getQuery()._id;

    const commentModel = this.model.db.model('Comment');
    await commentModel.deleteMany({ post: currentPostId });

    next();
  } catch (error) {
    throw new Error(error);
  }
});
