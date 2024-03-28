import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  UserRegisterInputDto,
  VerifyEmailInputDto,
  ChangePasswordInputDto,
  ChangeEmailInputDto,
  LoginInputDto,
  UpdateUserInputDto,
  ForgotPasswordInputDto,
  ResetPasswordInputDto,
} from './dto/UserInput.dto';
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
    const user: Partial<User> = {
      email: input.Email,
      fullname: input.Fullname,
      password: await onHashPassword(input.Password),
    };

    await this.userModel.create(user);

    const otp = onGenerateOTP(6);
    await this.storeAndSendOTP(input.Email, otp);

    return { message: 'Check your email' };
  }

  async storeAndSendOTP(email: string, otp: string): Promise<void> {
    console.log(`Stored OTP for ${email}: ${otp} (placeholder)`);
    await this.redisService.storeValueInTempStore(otp, email, 600, true);

    await this.mailerService.sendOTP(email, otp);
  }

  async verifyEmail(input: VerifyEmailInputDto): Promise<SuccessOutput> {
    await this.validateOTP(input.Email, input.OTP);

    await this.updateVerifyEmailStatus(input.Email);

    return { isSuccess: true };
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
    const deletedUser = await this.userModel.findOneAndDelete({ _id });
    if (!deletedUser) {
      throw new NotFoundException('Invalid user specified!');
    }

    return { isSuccess: true };
  }

  async changeEmail(input: ChangeEmailInputDto, _id: string): Promise<MessageOutput> {
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
  }

  async changePassword(input: ChangePasswordInputDto, _id: string): Promise<SuccessOutput> {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('Invalid user specified!');
    }

    const isMatched = onComparePassword(user.password, input.Password);
    if (!isMatched) throw new NotFoundException('Invalid credentials specified');

    await this.userModel.findOneAndUpdate({ _id }, { $set: { password: onHashPassword(input.NewPassword) } });

    return { isSuccess: true };
  }

  async updateUser(input: UpdateUserInputDto, _id: string): Promise<SuccessOutput> {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException('Invalid user specified!');
    }

    await this.userModel.findOneAndUpdate({ _id }, { $set: { fullname: input.Fullname } });

    return { isSuccess: true };
  }

  async forgotPassword(input: ForgotPasswordInputDto): Promise<MessageOutput> {
    const user = await this.getByEmail(input.Email);
    if (!user) {
      throw new NotFoundException('Invalid user specified!');
    }

    const otp = onGenerateOTP(6);
    await this.storeAndSendOTP(input.Email, otp);

    return { message: 'Check your mailbox' };
  }

  async resetPassword(input: ResetPasswordInputDto): Promise<SuccessOutput> {
    await this.validateOTP(input.Email, input.OTP);

    await this.userModel.findOneAndUpdate({ email: input.Email }, { $set: { password: onHashPassword(input.Password) } });

    return { isSuccess: true };
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Invalid email specified');
    }

    return user;
  }

  async isUserExistById(_id: string): Promise<boolean> {
    const user = await this.userModel.findById({ _id });
    return !!user;
  }

  async getUserById(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new NotFoundException('Invalid user specified');
    }

    return user;
  }

  async updateVerifyEmailStatus(email: string): Promise<void> {
    const user = await this.userModel.findOneAndUpdate({ email }, { $set: { emailVerified: true } });

    if (!user) {
      throw new NotFoundException('Invalid user specified!');
    }
  }

  async validateOTP(email: string, otp: string) {
    const result = await this.redisService.getValueFromTempStore(email);

    if (result !== otp) {
      throw new BadRequestException('Invalid OTP for ' + email);
    }
  }
}
