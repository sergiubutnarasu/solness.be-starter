import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AppHelper, UserContext } from '~/core';
import { SharedUserService } from '~/shared/user';
import { AuthHelper } from '../helpers';
import { AuthKeys } from '../objects';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sharedUserService: SharedUserService) {
    super({
      jwtFromRequest: AuthHelper.computeJwtToken(),
      ignoreExpiration: false,
      secretOrKey: AppHelper.getConfig(AuthKeys.AuthSecret),
    });
  }

  public async validate(payload: any): Promise<UserContext> {
    const userId = payload.sub;
    const user = await this.sharedUserService.getUserAuthPayload(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
