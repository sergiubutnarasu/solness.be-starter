import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '~/modules/auth/decorators';
import { GraphQlAuthGuard, GraphQlRolesGuard } from '~/modules/auth/guards';
import {
  composeResult,
  CurrentUser,
  PageListInput,
  UserContext,
} from '~/modules/core';
import {
  PaginatedUserResponse,
  Role,
  User,
  UserInput,
  UserResponse,
} from '../objects';
import { UserService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlRolesGuard)
@Roles(Role.Admin)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  /**
   *
   * @param user Current logged user
   * @param request Page and page size
   * @returns Returns user response that contains a list of users
   */
  @Query(() => PaginatedUserResponse, { name: 'users' })
  public async find(
    @CurrentUser() user: UserContext,
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
  ) {
    const result = await this.service.findAndCount(user, request);

    return composeResult({ ...result });
  }

  /**
   * Use this method to get the user by ID
   * @param user - Current logged user
   * @param id - User identifier
   * @returns User response
   */
  @Query(() => UserResponse, { name: 'user' })
  public async get(
    @CurrentUser() user: UserContext,
    @Args('id') id: number,
  ): Promise<UserResponse> {
    const model = await this.service.get(id, user);

    if (!model) {
      return composeResult({
        success: false,
        message: 'User not found.',
      });
    }

    return composeResult({ data: model });
  }

  /**
   * Use this method to create or update an user
   * @param user Current logged user
   * @param model The user details
   * @returns User response
   */
  @Mutation(() => UserResponse, { name: 'saveUser' })
  public async save(
    @CurrentUser() user: UserContext,
    @Args({ name: 'model', type: () => UserInput })
    model: User,
  ): Promise<UserResponse> {
    const result = await this.service.save(user, model);

    return composeResult({ data: result });
  }

  /**
   * User this function if you want to delete an user
   * @param user Current logged user
   * @param id The user ID that will be deleted
   * @returns User response
   */
  @Mutation(() => UserResponse, { name: 'deleteUser' })
  public async delete(
    @CurrentUser() user: UserContext,
    @Args('id') id: number,
  ): Promise<UserResponse> {
    if (id === user.id) {
      return composeResult({
        success: false,
        message: 'Cannot delete the current user.',
      });
    }

    const result = await this.service.delete(id, user);

    return composeResult({ data: result });
  }
}
