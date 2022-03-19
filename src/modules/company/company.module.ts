import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedUserModule } from '~/shared/user';
import { CompanyRepository, CompanyUserRepository } from './repositories';
import { CompanyResolver, CompanyUserResolver } from './resolvers';
import { CompanyService, CompanyUserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRepository, CompanyUserRepository]),
    SharedUserModule,
  ],
  providers: [
    CompanyService,
    CompanyUserService,
    CompanyUserResolver,
    CompanyResolver,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
