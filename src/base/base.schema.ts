import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseSchema {
  _id: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
