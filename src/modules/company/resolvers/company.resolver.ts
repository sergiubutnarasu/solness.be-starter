import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Access, CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import { composeResult, PageListInput, UserContext } from '~/modules/core';
import {
  Company,
  CompanyInput,
  CompanyResponse,
  CompanyUser,
  PaginatedCompanyResponse,
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

    return composeResult({ ...result });
  }

  /**
   * Use this method to get the company by ID
   * @param user - Current logged user
   * @param id - Company identifier
   * @returns Company response
   */
  @Access({ page: Page.Company, action: 'view' })
  @Query(() => Company, { name: 'company', nullable: true })
  public async get(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<Company> {
    const model = await this.service.get(id, user);

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
    const companyId = user.data.isAdmin ? model.id : user.data.companyId;
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

  @ResolveField(() => [CompanyUser], { nullable: true })
  public async users() {
    return await this.companyUserService.find();
  }
}
