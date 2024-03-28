import { Types } from 'mongoose';

const posts = [
  {
    contentFileId: new Types.ObjectId().toString(),
    _id: new Types.ObjectId(),
    title: 'title 1',
  },
];

export default posts;
