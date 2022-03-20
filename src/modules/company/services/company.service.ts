import { Injectable } from '@nestjs/common';
import { BaseService, UserContext } from '~/core';
import { Company, CompanyCashDetailsInput } from '../objects';
import { CompanyRepository } from '../repositories';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(protected readonly repo: CompanyRepository) {
    super(repo);
  }

  public async updateCashDetails(
    { initialCashIndex, initialCashValue }: CompanyCashDetailsInput,
    user: UserContext,
  ) {
    const companyId = +user.data.companyId;
    const result = await this.update(
      companyId,
      {
        initialCashIndex,
        initialCashValue: `${initialCashValue}`,
      },
      user,
    );

    return result;
  }
}
