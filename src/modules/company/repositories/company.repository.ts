import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository, UserContext } from '~/core';
import { Company } from '../objects';

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
      .andWhere('COMPANY_USER.verified = true')
      .andWhere('COMPANY_USER.userId = :userId', {
        userId: user.id,
      });
  }
}
