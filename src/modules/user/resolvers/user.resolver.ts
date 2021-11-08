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
   * Get the list of users
   * @param request Page and page size
   * @param user Current logged user
   * @returns Returns user response that contains a list of users
   */
  @Query(() => PaginatedUserResponse, { name: 'users' })
  public async find(
    @Args('request', { nullable: true })
    request: PageListInput = { page: 0, pageSize: 10 },
    @CurrentUser() user: UserContext,
  ) {
    const result = await this.service.findAndCount(request, user);

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
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<UserResponse> {
    const model = await this.service.get(id, user);

    if (!model) {
      return composeResult({
        success: false,
        messages: ['User not found.'],
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
    @Args({ name: 'model', type: () => UserInput })
    model: User,
    @CurrentUser() user: UserContext,
  ): Promise<UserResponse> {
    const result = await this.service.save(model, user);

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
    @Args('id') id: number,
    @CurrentUser() user: UserContext,
  ): Promise<UserResponse> {
    if (id === user.id) {
      return composeResult({
        success: false,
        messages: ['Cannot delete the current user.'],
      });
    }

    const result = await this.service.delete(id, user);

    return composeResult({ data: result });
  }
}
