import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    NMailerModule.forRoot({
      // TODO: will manage env variable
      // TODO: Here library shows error log instead of success so please don't take it seriously it will be fixed in future
      transport: 'smtps://otpmailer99889898@gmail.com:jznt cnae iazw wevh@smtp.gmail.com',
    }),
  ],

  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}

/* import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerOptions, MailerModule as NMailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NMailerModule.forRootAsync({
      useFactory: async (configService: ConfigService): Promise<MailerOptions> => {
        console.log(configService.get('SMTP_APP_HOST'), configService.get('SMTP_APP_PORT'), configService.get('SMTP_APP_EMAIL'), configService.get('SMTP_APP_PASSWORD'));

        return {
          transport: {
            host: configService.get('SMTP_APP_HOST'),
            port: 587,
            secure: false,
            auth: {
              user: configService.get('SMTP_APP_EMAIL'),
              pass: configService.get('SMTP_APP_PASSWORD'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],

  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
 */
