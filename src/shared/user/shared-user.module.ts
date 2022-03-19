import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '~/libraries/email';
import { SharedUserRepository } from './repositories';
import { SharedUserService } from './services';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([SharedUserRepository])],
  providers: [SharedUserService],
  exports: [SharedUserService],
})
export class SharedUserModule {}
