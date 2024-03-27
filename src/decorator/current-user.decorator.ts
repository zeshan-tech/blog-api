import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(async (_data: unknown, context: ExecutionContext) => {
  const jwtService = new JwtService();

  const request = context.switchToHttp().getRequest();

  const authHeader = request.headers.authorization;

  if (!authHeader) throw new UnauthorizedException('Invalid authorization specified');

  const token = authHeader.split(' ')[1];

  const decodedData = jwtService.decode(token);

  const user: CurrentUserType = {
    _id: decodedData['_id'],
    email: decodedData['email'],
  };
  return user;
});
