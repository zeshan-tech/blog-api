import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RedisModule } from 'src/redis/redis.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RedisModule, MailerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
