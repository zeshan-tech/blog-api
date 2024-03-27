import { Types } from 'mongoose';

const users = [
  {
    _id: new Types.ObjectId('111111111111111111111111'),
    fullname: 'fullname',
    email: 'test1@example.com',
    password: 'password',
    emailVerified: false,
  },
];

export default users;
