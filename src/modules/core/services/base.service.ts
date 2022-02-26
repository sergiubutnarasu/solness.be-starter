import { DeepPartial, SelectQueryBuilder } from 'typeorm';
import { PaginatedResponse } from '..';
import { PaginationHelper } from '../helpers';
import { BaseEntity } from '../objects/entities';
import { PageListInput } from '../objects/inputs';
import { UserContext } from '../objects/types';
import { BaseCrudService } from './base-crud.service';

export abstract class BaseService<
  TEntity extends BaseEntity,
> extends BaseCrudService<TEntity> {
  protected abstract addAccessCondition(
    query: SelectQueryBuilder<TEntity>,
    user: UserContext,
  ): SelectQueryBuilder<TEntity>;

  public async create(
    model: DeepPartial<TEntity>,
    user: UserContext,
  ): Promise<TEntity> {
    model.enabled = true;
    return await this.saveEntity(model, user.id);
  }

  public async all(user: UserContext): Promise<TEntity[]> {
    const query = this.repo.createQueryBuilder('GENERIC');
    const conditionQuery = this.addAccessCondition(query, user);

    return await conditionQuery.getMany();
  }

  public async delete(id: number, user: UserContext): Promise<TEntity> {
    const entity = await this.get(id, user);

    if (entity) {
      return await this.repo.remove(entity);
    }

    return;
  }

  public async findAndCount<TRequest extends PageListInput>(
    request: TRequest,
    user: UserContext,
  ): Promise<PaginatedResponse<TEntity>> {
    const skip = PaginationHelper.calculateOffset(
      request.page,
      request.pageSize,
    );

    const query = this.repo
      .createQueryBuilder('GENERIC')
      .skip(skip)
      .take(request.pageSize)
      .where('GENERIC.enabled = 1');

    const conditionQuery = this.addAccessCondition(query, user);
    const [results, count] = await conditionQuery.getManyAndCount();

    return { data: results, total: count };
  }

  public async get(id: number, user: UserContext): Promise<TEntity> {
    const query = this.repo
      .createQueryBuilder('GENERIC')
      .where('GENERIC.id = :id', { id });

    const conditionQuery = this.addAccessCondition(query, user);

    return await conditionQuery.getOne();
  }

  public async save(
    model: DeepPartial<TEntity>,
    user: UserContext,
  ): Promise<TEntity> {
    const result = !!model.id
      ? await this.update(model.id, model, user)
      : await this.create(model, user);
    return result;
  }

  public async update(
    id: number,
    model: DeepPartial<TEntity>,
    user: UserContext,
  ): Promise<TEntity> {
    const existsModel = await this.get(id, user);
    if (!!existsModel) {
      const data = { ...existsModel, ...model };
      return await this.saveEntity(data, user.id);
    }

    return null;
  }
}
