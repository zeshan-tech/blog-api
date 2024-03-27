import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthManager {
  private readonly logger = new Logger(AuthManager.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async insertUser() {
    try {
      const newUser = new this.userModel({
        fullname: process.env.TEST_USER_FULLNAME,
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
        emailVerified: true,
      });

      await newUser.save();

      this.logger.log('User inserted successfully');
    } catch (error) {
      throw new Error(error);
    }
  }

  async generateToken() {
    try {
      const user = await this.userModel.findOne({ email: process.env.TEST_USER_EMAIL });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const payload = {
        email: user.email,
        _id: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // You can customize expiresIn as needed

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
