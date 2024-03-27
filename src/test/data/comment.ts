import { Types } from 'mongoose';

const comments = [
  {
    _id: new Types.ObjectId('111111111111111111111111'),
    text: 'test comment',
    post: '111111111111111111111111',
    user: '111111111111111111111111',
  },
  {
    _id: new Types.ObjectId('111111111111111111111111'),
    title: 'title 2',
    user: '111111111111111111111111',
    post: '111111111111111111111111',
  },
];

export default comments;
