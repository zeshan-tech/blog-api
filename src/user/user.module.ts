import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RedisModule } from '../redis/redis.module';
import { MailerModule } from '../mailer/mailer.module';
import { AuthModule } from '../auth/auth.module';
import { IsUniqueEmailConstraint } from '../decorator/is-unique-email.decorator';

@Module({
  imports: [forwardRef(() => AuthModule), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RedisModule, MailerModule],
  controllers: [UserController],
  providers: [UserService, IsUniqueEmailConstraint],
  exports: [UserService],
})
export class UserModule {}
