import { Controller, Post, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserRegisterInputDto,
  VerifyEmailInputDto,
  ChangePasswordInputDto,
  ChangeEmailInputDto,
  UpdateUserInputDto,
  LoginInputDto,
  ForgotPasswordInputDto,
  ResetPasswordInputDto,
} from './dto/UserInput.dto';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../decorator/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() input: UserRegisterInputDto) {
    return await this.userService.register(input);
  }

  @Post('verify-email')
  verifyEmail(@Body() input: VerifyEmailInputDto) {
    return this.userService.verifyEmail(input);
  }

  @Post('login')
  async login(@Body() input: LoginInputDto) {
    const user = await this.userService.login(input);
    const token = this.authService.signToken(user);
    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@CurrentUser() currentUser: CurrentUserType) {
    return this.userService.deleteUser(currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Body() input: ChangePasswordInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.userService.changePassword(input, currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-email')
  changeEmail(@Body() input: ChangeEmailInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.userService.changeEmail(input, currentUser._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  updateUser(@Body() input: UpdateUserInputDto, @CurrentUser() currentUser: CurrentUserType) {
    return this.userService.updateUser(input, currentUser._id);
  }

  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotPasswordInputDto) {
    return this.userService.forgotPassword(input);
  }

  @Put('reset-password')
  resetPassword(@Body() input: ResetPasswordInputDto) {
    return this.userService.resetPassword(input);
  }
}
