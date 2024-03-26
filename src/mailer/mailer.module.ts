import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NMailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    NMailerModule.forRoot({
      // TODO: will manage env variable
      transport: 'smtps://zeshanshakil0@gmail.com:afyc gohd sxvw xyrd@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],

  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
