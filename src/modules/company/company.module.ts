import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository, CompanyUserRepository } from './repositories';
import { CompanyResolver } from './resolvers';
import { CompanyService, CompanyUserService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRepository, CompanyUserRepository]),
  ],
  providers: [CompanyService, CompanyUserService, CompanyResolver],
})
export class CompanyModule {}
