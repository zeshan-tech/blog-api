import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from '../../base/base.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseSchema {
  @Prop()
  fullname: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('findOneAndDelete', async function (next) {
  try {
    const currentCommentId = await this.getQuery()._id;

    await this.model.db.model('Comment').deleteMany({ user: currentCommentId });
    await this.model.db.model('Post').deleteMany({ user: currentCommentId });

    next();
  } catch (error) {
    throw new Error(error);
  }
});
