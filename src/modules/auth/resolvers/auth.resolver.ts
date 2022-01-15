import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { composeResult, SimpleResponse } from '~/modules/core';
import { AuthHelper } from '../helpers';
import { TokenResponse } from '../objects';
import { AuthService } from '../services';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenResponse, { name: 'login' })
  public async login(
    @Context() ctx: any,
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
    const payload = await AuthHelper.secureJwtToken(ctx.req, token);

    return composeResult({ data: payload });
  }

  @Mutation(() => SimpleResponse, { name: 'logout' })
  public async logout(
    @Context() ctx: any,
    @Args('refreshToken') refreshToken: string,
  ): Promise<SimpleResponse> {
    await this.authService.logout(refreshToken);

    AuthHelper.clearSignature(ctx.req);

    return composeResult();
  }

  @Mutation(() => TokenResponse, { name: 'refresh' })
  public async refresh(
    @Context() ctx: any,
    @Args('refreshToken') refreshToken: string,
    @Args('accessToken') accessToken: string,
  ): Promise<TokenResponse> {
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException();
    }

    const token = await this.authService.refresh(
      refreshToken,
      AuthHelper.createJwtSecureToken(ctx.req, accessToken),
    );

    if (!token) {
      throw new UnauthorizedException();
    }

    const payload = await AuthHelper.secureJwtToken(ctx.req, token);

    return composeResult({ data: payload });
  }
}
