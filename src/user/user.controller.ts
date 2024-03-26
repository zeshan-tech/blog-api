import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterInputDto, VerifyEmailInputDto } from './dto/UserInput.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  register(@Body() input: UserRegisterInputDto) {
    return this.userService.register(input);
  }

  @Post('validate-otp')
  verifyEmail(@Body() input: VerifyEmailInputDto) {
    return this.userService.verifyEmail(input);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
