import { Post } from '../schema/post.schema';

export interface GetPostOutputDto extends Post {
  content: Buffer;
}
