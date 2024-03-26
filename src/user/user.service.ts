import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterInputDto, VerifyEmailInputDto } from './dto/UserInput.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { onHashPassword } from 'src/common/utils/onHashPassword';
import { RedisService } from 'src/redis/redis.service';
import * as otpGenerator from 'otp-generator';
import { MailerService } from 'src/mailer/mailer.service';
import { MessageOutput } from 'src/common/dto/CommonOutput.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private catModel: Model<User>,

    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async register(input: UserRegisterInputDto): Promise<MessageOutput> {
    try {
      const user = new User();

      user.email = input.email;
      user.fullname = input.fullname;
      user.password = await onHashPassword(input.password);

      const createdCat = new this.catModel(user);
      await createdCat.save();

      const otp = otpGenerator.generate(6);
      await this.storeAndSendOTP(input.email, otp);

      return { message: 'Check your email' };
    } catch (error) {
      throw new Error(error);
    }
  }


  async storeAndSendOTP(email: string, otp: string): Promise<void> {
    try {
      console.log(`Stored OTP for ${email}: ${otp} (placeholder)`);
      await this.redisService.storeValueInTempStore(otp, email);

      await this.mailerService.sendOTP(email, otp);
    } catch (error) {
      throw new Error(error);
    }
  }

  verifyEmail(input: VerifyEmailInputDto) {}

  async validateOTP(email: string, otp: string) {
    const result = await this.redisService.getValueFromTempStore(email);

    if (result !== otp) {
      throw new Error(
    }
  }
}
