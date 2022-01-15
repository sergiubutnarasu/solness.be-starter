import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user';
import { CompanyRepository, CompanyUserRepository } from './repositories';
import { CompanyResolver, CompanyUserResolver } from './resolvers';
import { CompanyService, CompanyUserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRepository, CompanyUserRepository]),
    UserModule,
  ],
  providers: [
    CompanyService,
    CompanyUserService,
    CompanyUserResolver,
    CompanyResolver,
  ],
})
export class CompanyModule {}
