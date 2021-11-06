import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from '~/modules/core';
import { Company } from '../objects';
import { CompanyRepository } from '../repositories';

@Injectable()
export class CompanyService extends BaseService<Company> {
  protected addAccessCondition(
    query: SelectQueryBuilder<Company>,
  ): SelectQueryBuilder<Company> {
    return query;
  }

  constructor(protected readonly repo: CompanyRepository) {
    super(repo);
  }
}
