import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { IsPublic } from './decorators/is-public.decorator';
import { SendOTPDto, VerifyOTPDto, LoginDto } from './dtos/auth.dto';
import RefreshTokenGuard from './guards/refresh-token.guard';
import { AuthService } from './services/auth.service';
import { IRefreshTokenPayload } from './types/token.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('/login-otp')
  async sendOtp(@Body() body: SendOTPDto) {
    return this.authService.sendOTP(body);
  }
  @IsPublic()
  @Post('/verify-otp')
  async verifyOtp(@Body() body: VerifyOTPDto) {
    return this.authService.verifyOTP(body);
  }

  @IsPublic()
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @IsPublic()
  @Post('/signup')
  async signup(@Body() body: SignupUserDto) {
    const user = await this.authService.signup(body);
    return { user };
  }

  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshToken(@GetUser() refreshToken: IRefreshTokenPayload) {
    const accessToken = await this.authService.refreshToken(refreshToken.sub);
    return { accessToken };
  }
}

// keycloak , totp
// multiple authentication
