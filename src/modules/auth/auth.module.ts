import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppHelper } from '../core';
import { EmailModule } from '../email';
import { UserModule } from '../user';
import { AuthController } from './controllers';
import { AuthKeys } from './objects';
import { AuthRepository } from './repositories';
import { AuthService } from './services';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: AppHelper.getConfig(AuthKeys.AuthSecret),
      signOptions: { expiresIn: '10m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([AuthRepository]),
    UserModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
