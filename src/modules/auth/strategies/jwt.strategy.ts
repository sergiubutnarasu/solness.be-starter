import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AppHelper, UserContext } from '~/modules/core';
import { UserService } from '~/modules/user';
import { AuthHelper } from '../helpers';
import { AuthKeys } from '../objects';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: AuthHelper.computeJwtToken(),
      ignoreExpiration: false,
      secretOrKey: AppHelper.getConfig(AuthKeys.AuthSecret),
    });
  }

  public async validate(payload: any): Promise<UserContext> {
    const userId = payload.sub;
    const user = await this.userService.getUserAuthPayload(userId);

    if (user) {
      return user;
    }

    throw new BadRequestException();
  }
}
