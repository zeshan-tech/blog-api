import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid authorization specified');
    }

    const token = authHeader.split(' ')[1];

    const tokenUser: TokenUserType = this.authService.decodeToken(token);
    if (!tokenUser) {
      throw new UnauthorizedException('Invalid authorization specified');
    }

    await this.authService.authenticateUser(tokenUser.email);

    return true;
  }
}
