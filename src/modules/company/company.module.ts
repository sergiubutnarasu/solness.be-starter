import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './repositories';
import { CompanyResolver } from './resolvers';
import { CompanyService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  providers: [CompanyService, CompanyResolver],
  exports: [CompanyService],
})
export class CompanyModule {}
