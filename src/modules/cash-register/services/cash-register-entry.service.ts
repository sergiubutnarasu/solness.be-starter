import { Injectable } from '@nestjs/common';
import { BaseService, UserContext } from '~/core';
import {
  CashRegisterEntry,
  CashRegisterEntryDetails,
  CashRegisterEntryInput,
} from '../objects';
import { CashRegisterEntryRepository } from '../repositories';

@Injectable()
export class CashRegisterEntryService extends BaseService<CashRegisterEntry> {
  constructor(protected readonly repo: CashRegisterEntryRepository) {
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
    const previousData = await this.repo.getPreviousEntriesData(date, user);

    return {
      entries: entries ?? [],
      previousTotalValue: previousData.previousTotalValue,
      previousEntriesCount: previousData.previousEntriesCount,
    };
  }

  public async getLastEntryDate(user: UserContext) {
    const result = await this.repo.getLastEntryDate(user);

    return result;
  }

  public async saveEntries(
    entries: CashRegisterEntryInput[],
    user: UserContext,
  ) {
    const companyId = +user.data.companyId;

    const oldList = entries
      .filter(({ id }) => !!id)
      .map((entry) => ({ ...entry, enabled: true, companyId }));

    const newList = entries
      .filter(({ id }) => !id)
      .map((entry) => ({
        ...entry,
        companyId,
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
