import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository, Role, UserContext } from '~/modules/core';
import { CompanyUser } from '../objects';

@EntityRepository(CompanyUser)
export class CompanyUserRepository extends BaseRepository<CompanyUser> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CompanyUser>,
    user: UserContext,
  ): SelectQueryBuilder<CompanyUser> {
    return query.andWhere('GENERIC.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  public async getByUserId(userId: number, user: UserContext) {
    return await this.createQueryBuilder('COMPANY_USER')
      .select('COMPANY_USER.id')
      .where(
        'COMPANY_USER.userId = :userId AND COMPANY_USER.companyId = :companyId',
        { userId, companyId: +user.data.companyId },
      )
      .getOne();
  }

  public async excludeUser(userId: number, user: UserContext) {
    const entity = await this.getByUserId(userId, user);

    if (!entity) {
      return;
    }

    await this.delete(entity.id);
  }
}
