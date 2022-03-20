import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
  composeResult,
  PageListInput,
  SimpleResponse,
  UserContext,
} from '~/core';
import { Access, CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import {
  Company,
  CompanyCashDetailsInput,
  CompanyInput,
  CompanyResponse,
  PaginatedCompanyResponse,
  PaginatedCompanyUserResponse,
} from '../objects';
import { CompanyService, CompanyUserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard)
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
  @Access({ page: Page.Company, action: 'view' })
  @Query(() => PaginatedCompanyResponse, { name: 'companies' })
  public async find(
    @CurrentUser() user: UserContext,
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
  ) {
    const result = await this.service.findAndCount(request, user);

    return result;
  }

  /**
   * Use this method to get the company by ID
   * @param user - Current logged user
   * @param id - Company identifier
   * @returns Company response
   */
  @Access({ page: Page.Company, action: 'view' })
  @Query(() => Company, { name: 'company', nullable: true })
  public async get(@CurrentUser() user: UserContext): Promise<Company> {
    let companyId = +user.data.companyId;

    if (!companyId) {
      throw new NotFoundException('Company ID is missing.');
    }

    const model = await this.service.get(companyId, user);

    if (!model) {
      throw new NotFoundException('Company not found.');
    }

    return model;
  }

  /**
   * Use this method to create a company
   * @param user Current logged user
   * @param model The company details
   * @returns Company response
   */
  @Access({ page: Page.Company, action: 'create' })
  @Mutation(() => CompanyResponse, { name: 'createCompany' })
  public async create(
    @Args({ name: 'model', type: () => CompanyInput })
    model: Company,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const result = await this.service.create(model, user);

    return composeResult({ data: result });
  }

  /**
   * Use this method to update a company
   * @param user Current logged user
   * @param model The company details
   * @returns Company response
   */
  @Access({ page: Page.Company, action: 'update' })
  @Mutation(() => CompanyResponse, { name: 'updateCompany' })
  public async update(
    @Args({ name: 'model', type: () => CompanyInput })
    model: Company,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const companyId = +user.data.companyId;

    if (!companyId) {
      throw new NotFoundException('Company ID is missing.');
    }

    model.id = companyId;
    const result = await this.service.update(+companyId, model, user);

    return composeResult({ data: result });
  }

  /**
   * Use this function if you want to delete a company
   * @param user Current logged user
   * @param id The company ID that will be deleted
   * @returns Company response
   */
  @Access({ page: Page.Company, action: 'delete' })
  @Mutation(() => CompanyResponse, { name: 'deleteCompany' })
  public async delete(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyResponse> {
    const result = await this.service.delete(id, user);

    return composeResult({ data: result });
  }

  @Access({ page: Page.Company, action: 'view' })
  @ResolveField(() => PaginatedCompanyUserResponse, { nullable: true })
  public async users(
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
    @CurrentUser() user: UserContext,
  ) {
    return await this.companyUserService.findAndCount(request, user);
  }

  @Access({ page: Page.Cash, action: 'update' })
  @Mutation(() => SimpleResponse, { name: 'updateCompanyCashDetails' })
  public async updateCashDetails(
    @Args('model', { type: () => CompanyCashDetailsInput })
    cashDetails: CompanyCashDetailsInput,
    @CurrentUser() user: UserContext,
  ) {
    await this.service.updateCashDetails(cashDetails, user);

    return composeResult();
  }
}
