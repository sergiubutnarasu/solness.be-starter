import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService, DateHelper, Role, UserContext } from '~/modules/core';
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

  public async getGrouped(user: UserContext) {
    const genericQuery = this.repo.createQueryBuilder('GENERIC');
    const conditionQuery = this.addAccessCondition(genericQuery, user);
    const result = await conditionQuery
      .select('GENERIC.date')
      .groupBy('date')
      .orderBy('date')
      .getMany();

    return result?.map(({ date }) => DateHelper.getDate(date));
  }

  public async getByDate(date: Date, user: UserContext) {
    const dateParameter = DateHelper.getDate(date);

    const query = this.repo
      .createQueryBuilder('GENERIC')
      .where('DATE(GENERIC.date) = :date', { date: dateParameter });
    const conditionQuery = this.addAccessCondition(query, user);

    return await conditionQuery.getMany();
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
    const dateParameter = DateHelper.getDate(date);

    const query = this.repo
      .createQueryBuilder()
      .delete()
      .where('DATE(date) = :date', { date: dateParameter })
      .andWhere('companyId = :companyId', {
        companyId: user.data.companyId,
      });

    return await query.execute();
  }

  public async deleteByIds(ids: number[], user: UserContext) {
    if (!ids) {
      return;
    }

    const query = this.repo
      .createQueryBuilder()
      .delete()
      .whereInIds(ids)
      .andWhere('companyId = :companyId', {
        companyId: user.data.companyId,
      });

    return await query.execute();
  }
}
