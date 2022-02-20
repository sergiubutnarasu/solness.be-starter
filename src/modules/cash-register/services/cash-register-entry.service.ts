import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService, Role, UserContext } from '~/modules/core';
import { CashRegisterEntry } from '../objects';
import { CashRegisterEntryRepository } from '../repositories';

@Injectable()
export class CashRegisterEntryService extends BaseService<CashRegisterEntry> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CashRegisterEntry>,
    user: UserContext,
  ): SelectQueryBuilder<CashRegisterEntry> {
    if (user.role === Role.Admin) {
      return query;
    }

    return query.andWhere('GENERIC.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  constructor(protected readonly repo: CashRegisterEntryRepository) {
    super(repo);
  }
}
