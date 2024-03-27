import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    NMailerModule.forRoot({
      // TODO: will manage env variable
      // TODO: Here library shows error log instead of success so please don't take it seriously it will be fixed in future
      transport: 'smtps://zeshanshakil0@gmail.com:wyvt gjmq aimg pzzn@smtp.gmail.com',
    }),
  ],

  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
