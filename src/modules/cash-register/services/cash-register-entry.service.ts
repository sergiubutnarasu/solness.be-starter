import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { CompanyService } from '~/modules/company/services';
import { BaseService, DateHelper, Role, UserContext } from '~/modules/core';
import { CashRegisterEntry, CashRegisterEntryDetails } from '../objects';
import { CashRegisterEntryRepository } from '../repositories';

@Injectable()
export class CashRegisterEntryService extends BaseService<CashRegisterEntry> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CashRegisterEntry>,
    user: UserContext,
  ): SelectQueryBuilder<CashRegisterEntry> {
    return query.andWhere('GENERIC.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  constructor(
    protected readonly repo: CashRegisterEntryRepository,
    private readonly companyService: CompanyService,
  ) {
    super(repo);
  }

  public async getGrouped(user: UserContext) {
    const result = await this.repo.getGrouped(user);

    return result;
  }

  public async getByDate(
    date: Date,
    user: UserContext,
  ): Promise<CashRegisterEntryDetails> {
    const entries = await this.repo.getByDate(date, user);
    const companyCashDetails = await this.companyService.getCashDetails(user);
    const previousData = await this.repo.getPreviousEntriesData(date, user);

    return {
      entries: entries ?? [],
      companyCashDetails,
      previousTotalValue: previousData.previousTotalValue,
      previousEntriesCount: previousData.previousEntriesCount,
    };
  }

  public async saveEntries(entries: CashRegisterEntry[], user: UserContext) {
    const oldList = entries
      .filter(({ id, companyId }) => !!id && companyId === user.data.companyId)
      .map((entry) => ({ ...entry, enabled: true }));

    const newList = entries
      .filter(({ id }) => !id)
      .map((entry) => ({
        ...entry,
        companyId: +user.data.companyId,
        enabled: true,
      }));

    await this.saveEntities(oldList, user.id);
    await this.saveEntities(newList, user.id);
  }

  public async deleteByDate(date: Date, user: UserContext) {
    const result = await this.repo.deleteByDate(date, user);

    return result;
  }

  public async deleteByIds(ids: number[], user: UserContext) {
    const result = await this.repo.deleteByIds(ids, user);

    return result;
  }
}
