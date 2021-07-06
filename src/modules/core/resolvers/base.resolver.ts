import { BadRequestException, NotFoundException, Type } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../decorators';
import { composeResult } from '../helpers';
import {
  BaseEntity,
  GenericResponse,
  GraphQLGenericResponse,
  IBaseResolverOptions,
  PageList,
  PageListInput,
  PaginatedResponse,
  UserContext,
} from '../objects';
import { BaseService } from '../services';

export function createBaseResolver<
  TEntity extends BaseEntity,
  TInputEntity extends BaseEntity,
  TService extends BaseService<TEntity>
>(
  suffix: string,
  TEntityClass: Type<TEntity>,
  TInputEntityClass: Type<TInputEntity>,
  options: IBaseResolverOptions = null,
): any {
  const PaginatedBaseResponse = PaginatedResponse(TEntityClass);
  const GraphQLGenericBaseResponse = GraphQLGenericResponse(TEntityClass);

  const findSuffix =
    !!options && options.overrideFind ? `Override${suffix}` : suffix;

  const getSuffix =
    !!options && options.overrideGet ? `Override${suffix}` : suffix;

  const saveSuffix =
    !!options && options.overrideSave ? `Override${suffix}` : suffix;

  const deleteSuffix =
    !!options && options.overrideDelete ? `Override${suffix}` : suffix;

  @Resolver(() => TEntityClass, { isAbstract: true })
  abstract class BaseResolver {
    constructor(private readonly baseService: TService) {}

    @Query(() => PaginatedBaseResponse, {
      name: `all${findSuffix}`,
      nullable: true,
    })
    public async all(
      @CurrentUser() user: UserContext,
    ): Promise<PageList<TEntity>> {
      if (!!options && options.overrideFind) {
        throw new BadRequestException();
      }

      const result = await this.baseService.all(user);

      return (composeResult({
        data: result,
        success: true,
      }) as unknown) as PageList<TEntity>;
    }

    @Query(() => PaginatedBaseResponse, {
      name: `find${findSuffix}`,
      nullable: true,
    })
    public async find(
      @CurrentUser() user: UserContext,
      @Args('request') request: PageListInput,
    ): Promise<PageList<TEntity>> {
      if (!!options && options.overrideFind) {
        throw new BadRequestException();
      }

      const result = await this.baseService.findAndCount(user, request);

      return (composeResult({ ...result }) as unknown) as PageList<TEntity>;
    }

    @Query(() => GraphQLGenericBaseResponse, {
      name: `get${getSuffix}`,
      nullable: true,
    })
    public async get(
      @CurrentUser() user: UserContext,
      @Args('id') id: number,
    ): Promise<GenericResponse<TEntity>> {
      if (!!options && options.overrideGet) {
        throw new BadRequestException();
      }

      const model = await this.baseService.get(id, user);
      if (!model) {
        throw new NotFoundException(id);
      }

      return composeResult({ data: model });
    }

    @Mutation(() => GraphQLGenericBaseResponse, { name: `save${saveSuffix}` })
    public async save(
      @CurrentUser() user: UserContext,
      @Args({ name: 'model', type: () => TInputEntityClass })
      model: TEntity,
    ): Promise<GenericResponse<TEntity>> {
      if (!!options && options.overrideSave) {
        throw new BadRequestException();
      }

      const result = await this.baseService.save(user, model);

      return composeResult({ data: result });
    }

    @Mutation(() => GraphQLGenericBaseResponse, {
      name: `delete${deleteSuffix}`,
    })
    public async delete(
      @CurrentUser() user: UserContext,
      @Args('id') id: number,
    ): Promise<GenericResponse<TEntity>> {
      if (id === user.id) {
        return composeResult({
          success: false,
          message: 'Cannot delete the current user',
        });
      }

      if (!!options && options.overrideDelete) {
        throw new BadRequestException();
      }

      const result = await this.baseService.delete(id, user);
      return composeResult({ data: result });
    }
  }

  return BaseResolver;
}
