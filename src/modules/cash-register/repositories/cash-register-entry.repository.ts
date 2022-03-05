import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository, DateHelper, Role, UserContext } from '~/modules/core';
import { CashRegisterEntry } from '../objects';

@EntityRepository(CashRegisterEntry)
export class CashRegisterEntryRepository extends BaseRepository<CashRegisterEntry> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CashRegisterEntry>,
    user: UserContext,
  ): SelectQueryBuilder<CashRegisterEntry> {
    return query.andWhere('GENERIC.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  public async getGrouped(user: UserContext) {
    const genericQuery = this.createQueryBuilder('GENERIC');
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

    const query = this.createQueryBuilder('GENERIC')
      .where('DATE(GENERIC.date) = :date', { date: dateParameter })
      .orderBy('GENERIC.id');
    const conditionQuery = this.addAccessCondition(query, user);

    const result = await conditionQuery.getMany();

    return result ?? [];
  }

  public async getPreviousEntriesData(date: Date, user: UserContext) {
    const dateParameter = DateHelper.getDate(date);

    const query = this.createQueryBuilder('GENERIC')
      .select('GENERIC.value')
      .where('GENERIC.companyId = :companyId', {
        companyId: user.data.companyId,
      })
      .andWhere('GENERIC.date < :date', { date: dateParameter });

    const data = await query.getMany();

    const previousTotalValue =
      data?.reduce((total, { value }) => total + value, 0) ?? 0;

    return {
      previousTotalValue,
      previousEntriesCount: data?.length ?? 0,
    };
  }

  public async deleteByDate(date: Date, user: UserContext) {
    const dateParameter = DateHelper.getDate(date);

    const query = this.createQueryBuilder()
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

    const query = this.createQueryBuilder()
      .delete()
      .whereInIds(ids)
      .andWhere('companyId = :companyId', {
        companyId: user.data.companyId,
      });

    return await query.execute();
  }
}
