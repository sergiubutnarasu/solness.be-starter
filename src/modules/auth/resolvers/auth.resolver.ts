import { Request } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { composeResult, SimpleResponse } from '~/modules/core';
import { AuthHelper } from '../helpers';
import { TokenResponse } from '../objects';
import { AuthService } from '../services';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenResponse, { name: 'login' })
  public async login(
    @Request() req: any,
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<TokenResponse> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      return composeResult({
        success: false,
        messages: ['Login failed.'],
      });
    }

    const token = await this.authService.generateToken(user.id);
    const payload = await AuthHelper.secureJwtToken(req, token);

    return composeResult({ data: payload });
  }

  @Mutation(() => SimpleResponse, { name: 'logout' })
  public async logout(
    @Request() req: any,
    @Args('refreshToken') refreshToken: string,
  ): Promise<SimpleResponse> {
    await this.authService.logout(refreshToken);

    AuthHelper.clearSignature(req);

    return composeResult();
  }

  @Mutation(() => TokenResponse, { name: 'refresh' })
  public async refresh(
    @Request() req: any,
    @Args('refreshToken') refreshToken: string,
    @Args('accessToken') accessToken: string,
  ): Promise<TokenResponse> {
    if (!accessToken || !refreshToken) {
      return composeResult({
        success: false,
        messages: ['Missing parameters.'],
      });
    }

    const token = await this.authService.refresh(
      refreshToken,
      AuthHelper.createJwtSecureToken(req, accessToken),
    );

    if (!token) {
      return composeResult({
        success: false,
        messages: ['Refresh failed.'],
      });
    }

    const payload = await AuthHelper.secureJwtToken(req, token);

    return composeResult({ data: payload });
  }
}
