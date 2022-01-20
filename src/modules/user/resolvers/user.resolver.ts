import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Access, CurrentUser, Roles } from '~/modules/auth/decorators';
import {
  GraphQlAccessGuard,
  GraphQlAuthGuard,
  GraphQlRolesGuard,
} from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import {
  composeResult,
  PageListInput,
  Role,
  UserContext,
} from '~/modules/core';
import {
  PaginatedUserResponse,
  User,
  UserInput,
  UserResponse,
} from '../objects';
import { UserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard, GraphQlRolesGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  /**
   * Get the list of users
   * @param request Page and page size
   * @param user Current logged user
   * @returns Returns user response that contains a list of users
   */
  @Roles(Role.Admin)
  @Query(() => PaginatedUserResponse, { name: 'users' })
  public async find(
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
    @CurrentUser() user: UserContext,
  ) {
    const result = await this.service.findAndCount(request, user);

    return result;
  }

  /**
   * Use this method to get the user by ID
   * @param user - Current logged user
   * @param id - User identifier
   * @returns User response
   */
  @Roles(Role.Admin)
  @Query(() => User, { name: 'user', nullable: true })
  public async get(
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<User> {
    const model = await this.service.get(id, user);

    if (!model) {
      throw new NotFoundException('User not found.');
    }

    return model;
  }

  /**
   * Use this method to update an user
   * @param user Current logged user
   * @param model The user details
   * @returns User response
   */
  @Mutation(() => UserResponse, { name: 'updateUser' })
  public async update(
    @Args({ name: 'model', type: () => UserInput })
    model: User,
    @CurrentUser() user: UserContext,
  ): Promise<UserResponse> {
    const userId = user.data.isAdmin ? model.id : user.id;
    model.id = userId;
    const result = await this.service.update(userId, model, user);

    return composeResult({ data: result });
  }

  /**
   * Use this function if you want to delete an user
   * @param user Current logged user
   * @param id The user ID that will be deleted
   * @returns User response
   */
  @Mutation(() => UserResponse, { name: 'deleteUser' })
  public async delete(
    @CurrentUser() user: UserContext,
    @Args('id', { nullable: true }) id: number,
  ): Promise<UserResponse> {
    if (user.data.isAdmin && id === user.id) {
      throw new BadRequestException('Cannot delete the current admin user.');
    }

    const userId = user.data.isAdmin ? id : user.id;
    const result = await this.service.delete(userId, user);

    return composeResult({ data: result });
  }
}
