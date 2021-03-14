import {
  Body,
  ForbiddenException,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthHelper } from './../helpers';
import { AuthService } from './../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('authorize')
  async login(@Request() req: any) {
    const token = await this.authService.generateToken(req.user.id);

    return AuthHelper.secureJwtToken(req, token);
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    await this.authService.generateResetPasswordToken(email);
    return true;
  }

  @Post('change-password')
  async changePassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (await this.authService.verifyAndChangePassword(token, newPassword)) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('check-reset-password')
  async checkResetPasswordToken(@Body('token') token: string) {
    if (await this.authService.checkTokenAvailability(token)) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Body('refreshToken') refreshToken: string,
    @Body('accessToken') accessToken: string,
  ) {
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.refresh(
      refreshToken,
      AuthHelper.createJwtSecureToken(req, accessToken),
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    return AuthHelper.secureJwtToken(req, token);
  }

  @Post('logout')
  async logout(
    @Request() req: any,
    @Body('refreshToken') refreshToken: string,
  ) {
    await this.authService.logout(refreshToken);

    AuthHelper.clearSignature(req);
  }

  @UseGuards(AuthGuard())
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
