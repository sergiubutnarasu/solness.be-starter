import { EntityRepository } from 'typeorm';
import { BaseRepository, UserContext } from '~/modules/core';
import { CompanyUser } from '../objects';

@EntityRepository(CompanyUser)
export class CompanyUserRepository extends BaseRepository<CompanyUser> {
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
