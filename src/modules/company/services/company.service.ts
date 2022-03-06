import { Injectable } from '@nestjs/common';
import { BaseService, UserContext } from '~/modules/core';
import {
  Company,
  CompanyCashDetails,
  CompanyCashDetailsInput,
} from '../objects';
import { CompanyRepository } from '../repositories';

@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(protected readonly repo: CompanyRepository) {
    super(repo);
  }

  public async getCashDetails(user: UserContext): Promise<CompanyCashDetails> {
    const result = await this.repo.getCashDetails(user);

    return result;
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
