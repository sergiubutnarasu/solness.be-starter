import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, Roles } from '~/modules/auth/decorators';
import { GraphQlAuthGuard, GraphQlRolesGuard } from '~/modules/auth/guards';
import { composeResult, PageListInput, UserContext } from '~/modules/core';
import { Role } from '~/modules/user';
import {
  Company,
  CompanyInput,
  CompanyResponse,
  PaginatedCompanyResponse,
} from '../objects';
import { CompanyService, CompanyUserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlRolesGuard)
@Roles(Role.Admin)
@Resolver(() => Company)
export class CompanyResolver {
  constructor(
    private readonly service: CompanyService,
    private readonly companyUserService: CompanyUserService,
  ) {}

  /**
   * Get the list of companies
   * @param request Page and page size
   * @param user Current logged user
   * @returns Returns company response that contains a list of companies
   */
  @Query(() => PaginatedCompanyResponse, { name: 'companies' })
  public async find(
    @CurrentUser() user: UserContext,
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
  ) {
    const result = await this.service.findAndCount(request, user);

    return composeResult({ ...result });
  }

  /**
   * Use this method to get the company by ID
   * @param user - Current logged user
   * @param id - Company identifier
   * @returns Company response
   */
  @Query(() => CompanyResponse, { name: 'company' })
  public async get(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const model = await this.service.get(id, user);

    if (!model) {
      return composeResult({
        success: false,
        messages: ['Company not found.'],
      });
    }

    return composeResult({ data: model });
  }

  /**
   * Use this method to create or update a company
   * @param user Current logged user
   * @param model The company details
   * @returns Company response
   */
  @Mutation(() => CompanyResponse, { name: 'saveCompany' })
  public async save(
    @Args({ name: 'model', type: () => CompanyInput })
    model: Company,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const result = await this.service.save(model, user);

    return composeResult({ data: result });
  }

  /**
   * Use this function if you want to delete a company
   * @param user Current logged user
   * @param id The company ID that will be deleted
   * @returns Company response
   */
  @Mutation(() => CompanyResponse, { name: 'deleteCompany' })
  public async delete(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const result = await this.service.delete(id, user);

    return composeResult({ data: result });
  }
}
