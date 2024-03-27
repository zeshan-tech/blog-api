import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/JwtAuth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule,
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
