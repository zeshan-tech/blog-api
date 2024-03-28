import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRegisterInputDto, VerifyEmailInputDto, ChangePasswordInputDto, ChangeEmailInputDto, LoginInputDto, UpdateUserInputDto } from './dto/UserInput.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { onComparePassword, onHashPassword } from '../common/utils/bcrypt';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { MessageOutput, SuccessOutput } from '../common/dto/CommonOutput.dto';
import { onGenerateOTP } from '../common/utils/otpGenerator';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly redisService: RedisService, private readonly mailerService: MailerService) {}

  async register(input: UserRegisterInputDto): Promise<MessageOutput> {
    try {
      const user: Partial<User> = {
        email: input.Email,
        fullname: input.Fullname,
        password: await onHashPassword(input.Password),
      };

      await this.userModel.create(user);

      const otp = onGenerateOTP(6);
      await this.storeAndSendOTP(input.Email, otp);

      return { message: 'Check your email' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async storeAndSendOTP(email: string, otp: string): Promise<void> {
    try {
      console.log(`Stored OTP for ${email}: ${otp} (placeholder)`);
      await this.redisService.storeValueInTempStore(otp, email, 600, true);

      await this.mailerService.sendOTP(email, otp);
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyEmail(input: VerifyEmailInputDto): Promise<SuccessOutput> {
    try {
      await this.validateOTP(input.Email, input.OTP);

      await this.updateVerifyEmailStatus(input.Email);

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(input: LoginInputDto): Promise<User> {
    const user = await this.getByEmail(input.Email);
    if (!user) throw new NotFoundException('Invalid credentials specified');
    if (!user.emailVerified) throw new NotFoundException('Email not verified');

    const isMatched = onComparePassword(user.password, input.Password);
    if (!isMatched) throw new NotFoundException('Invalid credentials specified');

    return user;
  }

  async deleteUser(_id: string): Promise<SuccessOutput> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(_id);
      if (!deletedUser) {
        throw new NotFoundException('Invalid user specified!');
      }

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async changeEmail(input: ChangeEmailInputDto, _id: string): Promise<MessageOutput> {
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new NotFoundException('Invalid user specified!');
      }

      const isMatched = onComparePassword(user.password, input.Password);
      if (!isMatched) throw new UnauthorizedException('Invalid credentials specified');

      const otp = onGenerateOTP(6);
      await this.storeAndSendOTP(input.NewEmail, otp);

      await this.userModel.findOneAndUpdate({ _id }, { $set: { verifyEmail: false, email: input.NewEmail } });

      return { message: 'Please verify your new email address.' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(input: ChangePasswordInputDto, _id: string): Promise<SuccessOutput> {
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new NotFoundException('Invalid user specified!');
      }

      const isMatched = onComparePassword(user.password, input.Password);
      if (!isMatched) throw new NotFoundException('Invalid credentials specified');

      await this.userModel.findOneAndUpdate({ _id }, { $set: { password: input.NewPassword } });

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(input: UpdateUserInputDto, _id: string): Promise<SuccessOutput> {
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new NotFoundException('Invalid user specified!');
      }

      await this.userModel.findOneAndUpdate({ _id }, { $set: { fullname: input.Fullname } });

      return { isSuccess: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('Invalid email specified');
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async isUserExistById(_id: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById({ _id });
      return !!user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(_id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(_id);

      if (!user) {
        throw new NotFoundException('Invalid user specified');
      }

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateVerifyEmailStatus(email: string): Promise<void> {
    try {
      const user = await this.userModel.findOneAndUpdate({ email }, { $set: { verifyEmail: true } });

      if (!user) {
        throw new NotFoundException('Invalid user specified!');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateOTP(email: string, otp: string) {
    try {
      const result = await this.redisService.getValueFromTempStore(email);

      if (result !== otp) {
        throw new BadRequestException('Invalid OTP for ' + email);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
