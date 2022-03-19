import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '~/libraries/email';
import { SharedUserModule } from '~/shared/user';
import { UserRepository } from './repositories';
import { UserResolver } from './resolvers';
import { UserService } from './services';

@Module({
  imports: [
    EmailModule,
    SharedUserModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
