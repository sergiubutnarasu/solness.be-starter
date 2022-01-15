import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Access, CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import { composeResult, SimpleResponse, UserContext } from '~/modules/core';
import { CompanyUser, InviteUserInput } from '../objects';
import { CompanyUserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard)
@Resolver(() => CompanyUser)
export class CompanyUserResolver {
  constructor(private readonly companyUserService: CompanyUserService) {}

  @Access({ page: Page.Company, action: 'inviteUser' })
  @Mutation(() => SimpleResponse, { name: 'inviteUser' })
  public async inviteUser(
    @Args({ name: 'model', type: () => InviteUserInput })
    model: InviteUserInput,
    @CurrentUser() user: UserContext,
  ): Promise<SimpleResponse> {
    if (!user.data.companyId) {
      throw new BadRequestException('Company ID is missing.');
    }

    const result = await this.companyUserService.inviteUser(model, user);

    if (result) {
      return composeResult();
    }

    return composeResult({ success: false });
  }

  @Access({ page: Page.Company, action: 'excludeUser' })
  @Mutation(() => SimpleResponse, { name: 'excludeUser' })
  public async excludeUser(
    @Args('userId') userId: number,
    @CurrentUser() user: UserContext,
  ): Promise<SimpleResponse> {
    if (!user.data.companyId) {
      throw new BadRequestException('Company ID is missing.');
    }

    await this.companyUserService.excludeUser(userId, user);

    return composeResult();
  }
}
