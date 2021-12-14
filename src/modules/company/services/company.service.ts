import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService, Role, UserContext } from '~/modules/core';
import { Company } from '../objects';
import { CompanyRepository } from '../repositories';

@Injectable()
export class CompanyService extends BaseService<Company> {
  protected addAccessCondition(
    query: SelectQueryBuilder<Company>,
    user: UserContext,
  ): SelectQueryBuilder<Company> {
    if (user.role === Role.Admin) {
      return query;
    }

    return query
      .innerJoin(
        'companyUsers',
        'COMPANIES',
        'GENERIC.id = COMPANIES.companyId',
      )
      .andWhere('COMPANIES.userId = :userId', {
        userId: user.id,
      });
  }

  constructor(protected readonly repo: CompanyRepository) {
    super(repo);
  }
}
