import { Injectable } from '@nestjs/common';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly sendGrid: SendGridService, private readonly configService: ConfigService) { }

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.sendGrid.send({
        to: email,
        from: this.configService.get<string>('SEND_GRID_FROM_EMAIL'),
        subject: 'OTP Verification',
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
