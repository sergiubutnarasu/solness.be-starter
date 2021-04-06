import { BadRequestException, NotFoundException, Type } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../decorators';
import {
  BaseEntity,
  IBaseResolverOptions,
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
  type PaginatedBaseResponse = InstanceType<typeof PaginatedBaseResponse>;

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

    @Query(() => [TEntityClass], {
      name: `all${findSuffix}`,
      nullable: true,
    })
    public async all(@CurrentUser() user: UserContext): Promise<TEntity[]> {
      if (!!options && options.overrideFind) {
        throw new BadRequestException();
      }

      return await this.baseService.all(user);
    }

    @Mutation(() => TEntityClass, { name: `delete${deleteSuffix}` })
    public async delete(
      @CurrentUser() user: UserContext,
      @Args('id') id: number,
    ): Promise<TEntity> {
      if (id === user.id) {
        throw new BadRequestException();
      }

      if (!!options && options.overrideDelete) {
        throw new BadRequestException();
      }

      return await this.baseService.delete(id, user);
    }

    @Query(() => PaginatedBaseResponse, {
      name: `find${findSuffix}`,
      nullable: true,
    })
    public async find(
      @CurrentUser() user: UserContext,
      @Args('request') request: PageListInput,
    ): Promise<PaginatedBaseResponse> {
      if (!!options && options.overrideFind) {
        throw new BadRequestException();
      }

      return await this.baseService.findAndCount(user, request);
    }

    @Query(() => TEntityClass, { name: `get${getSuffix}`, nullable: true })
    public async get(
      @CurrentUser() user: UserContext,
      @Args('id') id: number,
    ): Promise<TEntity> {
      if (!!options && options.overrideGet) {
        throw new BadRequestException();
      }

      const model = await this.baseService.get(id, user);
      if (!model) {
        throw new NotFoundException(id);
      }
      return model;
    }

    @Mutation(() => TEntityClass, { name: `save${saveSuffix}` })
    public async save(
      @CurrentUser() user: UserContext,
      @Args({ name: 'model', type: () => TInputEntityClass })
      model: TEntity,
    ): Promise<TEntity> {
      if (!!options && options.overrideSave) {
        throw new BadRequestException();
      }

      return await this.baseService.save(user, model);
    }
  }

  return BaseResolver;
}
