import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '~/modules/core';
import { CompanyUser } from '../objects';
import { CompanyUserRepository } from '../repositories';

@Injectable()
export class CompanyUserService extends BaseService<CompanyUser> {
  protected addAccessCondition(
    query: SelectQueryBuilder<CompanyUser>,
  ): SelectQueryBuilder<CompanyUser> {
    return query;
  }

  constructor(protected readonly repo: CompanyUserRepository) {
    super(repo);
  }
}
