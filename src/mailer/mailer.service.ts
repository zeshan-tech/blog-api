import { Injectable } from '@nestjs/common';
import { MailerService as NMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly nMailerService: NMailerService) {}

  async sendOTP(email: string, otp: string): Promise<void> {
    try {
      await this.nMailerService.sendMail({
        to: email,
        from: 'noreply@example.com',
        subject: 'OTP Verification',
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
