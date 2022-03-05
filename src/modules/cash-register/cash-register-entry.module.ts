import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company';
import { CashRegisterEntryRepository } from './repositories';
import { CashRegisterEntryResolver } from './resolvers';
import { CashRegisterEntryService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashRegisterEntryRepository]),
    CompanyModule,
  ],
  providers: [CashRegisterEntryService, CashRegisterEntryResolver],
})
export class CashRegisterModule {}
