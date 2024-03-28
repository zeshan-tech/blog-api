import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
