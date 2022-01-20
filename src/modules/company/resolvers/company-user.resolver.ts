import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Access, CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import { composeResult, SimpleResponse, UserContext } from '~/modules/core';
import { UserService } from '~/modules/user';
import { User } from '~/modules/user/objects';
import { CompanyUser, InviteUserInput } from '../objects';
import { CompanyUserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard)
@Resolver(() => CompanyUser)
export class CompanyUserResolver {
  constructor(
    private readonly service: CompanyUserService,
    private readonly userService: UserService,
  ) {}

  @Access({ page: Page.Company, action: 'view' })
  @Query(() => CompanyUser, { name: 'companyUser', nullable: true })
  public async get(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<CompanyUser> {
    const model = await this.service.get(id, user);

    if (!model) {
      throw new NotFoundException('User not found.');
    }

    return model;
  }

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

    const result = await this.service.inviteUser(model, user);

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

    await this.service.excludeUser(userId, user);

    return composeResult();
  }

  @Access({ page: Page.Company, action: 'view' })
  @ResolveField(() => User)
  public async user(
    @Parent() companyUser: CompanyUser,
    @CurrentUser() user: UserContext,
  ) {
    return await this.userService.get(companyUser.userId, user);
  }
}
