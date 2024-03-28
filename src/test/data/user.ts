import { v4 as uuid } from 'uuid';

const users = [
  {
    fullname: 'fullname',
    email: `user${uuid()}@example.com`,
    password: 'password',
    emailVerified: true,
  },
];

export default users;
