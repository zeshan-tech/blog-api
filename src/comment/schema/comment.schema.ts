import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
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

CommentSchema.pre('findOneAndDelete', async function (next) {
  try {
    const currentCommentId = await this.getQuery()._id;

    const commentModel = this.model.db.model('Comment');
    await commentModel.deleteMany({ parentComment: currentCommentId });

    next();
  } catch (error) {
    throw new Error(error);
  }
});
