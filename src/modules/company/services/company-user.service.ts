import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService, Role, UserContext } from '~/modules/core';
import { CompanyUser } from '../objects';
import { CompanyUserRepository } from '../repositories';

@Injectable()
export class CompanyUserService extends BaseService<CompanyUser> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CompanyUser>,
    user: UserContext,
  ): SelectQueryBuilder<CompanyUser> {
    if (user.role === Role.Admin) {
      return query;
    }

    return query.andWhere('GENERIC.id.companyId = :companyId', {
      companyId: user.data.companyId,
    });
  }

  constructor(protected readonly repo: CompanyUserRepository) {
    super(repo);
  }
}
