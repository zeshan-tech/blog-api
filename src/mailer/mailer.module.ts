import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SendGridModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        apikey: configService.get<string>('SEND_GRID_API_KEY')
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule { }