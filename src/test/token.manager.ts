import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthManager {
  private readonly logger = new Logger(AuthManager.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async insertUser() {
    try {
      // Generate a random email address
      const randomEmail = `user${uuid()}@example.com`;

      const newUser = new this.userModel({
        fullname: 'test name',
        email: randomEmail,
        password: 'password',
        emailVerified: true,
      });

      await newUser.save();

      this.logger.log('User inserted successfully');

      return randomEmail;
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateToken(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const payload = {
        email: user.email,
        _id: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
