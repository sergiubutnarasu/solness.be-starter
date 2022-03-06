import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository, UserContext } from '~/modules/core';
import { Company, CompanyCashDetails } from '../objects';

@EntityRepository(Company)
export class CompanyRepository extends BaseRepository<Company> {
  protected addAccessCondition(
    query: SelectQueryBuilder<Company>,
    user: UserContext,
  ): SelectQueryBuilder<Company> {
    return query
      .innerJoin(
        'companyUser',
        'COMPANY_USER',
        'GENERIC.id = COMPANY_USER.companyId',
      )
      .andWhere('COMPANY_USER.verified = 1')
      .andWhere('COMPANY_USER.userId = :userId', {
        userId: user.id,
      });
  }

  public async getCashDetails(user: UserContext): Promise<CompanyCashDetails> {
    const query = this.createQueryBuilder('GENERIC')
      .select('GENERIC.id')
      .addSelect('GENERIC.initialCashIndex')
      .addSelect('GENERIC.initialCashValue')
      .where('GENERIC.id = :companyId', {
        companyId: user.data.companyId,
      });

    const additionalQuery = this.addAccessCondition(query, user);

    const data = await additionalQuery.getOne();

    if (data) {
      const { initialCashValue, initialCashIndex } = data;

      return {
        initialCashIndex: initialCashIndex ?? 1,
        initialCashValue: +initialCashValue ?? 0,
      };
    }
  }
}
