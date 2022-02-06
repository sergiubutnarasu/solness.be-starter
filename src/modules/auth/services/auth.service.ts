import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MoreThanOrEqual } from 'typeorm';
import { CryptoHelper, DateHelper, StringHelper } from '~/modules/core';
import { EmailService } from '~/modules/email';
import { UserService } from '~/modules/user';
import { TokenPayload, RefreshToken } from '../objects';
import { AuthRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly refreshTokenRepository: AuthRepository,
  ) {}

  private splitToken(token: string) {
    const data = token.split('.', 3);
    return { token: `${data[0]}.${data[1]}`, signature: data[2] };
  }

  public async validateUser(username: string, password: string) {
    const user = await this.userService.findOne({
      where: {
        email: username,
        enabled: true,
        verified: true,
      },
      select: ['password', 'id', 'role'],
    });

    if (user && CryptoHelper.compare(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  public async generateToken(userId: number): Promise<TokenPayload> {
    const userPayload = await this.userService.getUserAuthPayload(userId);

    const payload = {
      username: userPayload.email,
      sub: userPayload.id,
      role: userPayload.role,
      data: userPayload.data,
    };

    const accessToken = this.jwtService.sign(payload);
    const tokenData = this.splitToken(accessToken);
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken: tokenData.token,
      refreshToken,
      expiresIn: 600,
      signature: tokenData.signature,
    };
  }

  public async sendResetPasswordEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return false;
    }

    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload, { expiresIn: '24h' });
    await this.emailService.sendResetPasswordEmail(user.email, token);

    return true;
  }

  public async checkTokenAvailability(token: string) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch {
      return false;
    }
  }

  public async refresh(refreshToken: string, accessToken: string) {
    const oldRefreshToken = await this.refreshTokenRepository.findOne({
      token: refreshToken,
      expireDate: MoreThanOrEqual(new Date()),
    });
    try {
      const accessTokenData = this.jwtService.verify(accessToken, {
        ignoreExpiration: true,
      });

      if (
        !!oldRefreshToken &&
        !!accessTokenData &&
        accessTokenData.sub === oldRefreshToken.userId
      ) {
        return await this.generateToken(oldRefreshToken.userId);
      }
    } catch {
      return null;
    }
  }

  public async logout(refreshToken: string) {
    await this.deleteRefreshToken(refreshToken);
  }

  async verifyAndChangePassword(token: string, newPassword: string) {
    try {
      const { userId }: { userId: number } = await this.jwtService.verify(
        token,
      );

      if (userId) {
        return await this.userService.resetPassword(userId, newPassword);
      }
    } catch {
      return false;
    }
  }

  private async createRefreshToken(userId: any) {
    const length = Math.floor(Math.random() * 70) + 80;
    const token = StringHelper.generate(length);

    const refreshToken: RefreshToken = {
      enabled: true,
      userId,
      token,
      createdUserId: userId,
      createdDatetime: new Date(),
      expireDate: DateHelper.addDays(21),
    };

    await this.refreshTokenRepository.save(refreshToken, { data: { userId } });
    return token;
  }

  private async deleteRefreshToken(refreshToken: string) {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }
}
