import { SelectQueryBuilder } from 'typeorm';
import { PaginationHelper } from '../helpers';
import { BaseEntity } from '../objects/entities';
import { PageListInput } from '../objects/inputs';
import { PageList } from '../objects/model';
import { UserContext } from '../objects/types';
import { BaseCrudService } from './base-crud.service';

export abstract class BaseService<
  TEntity extends BaseEntity
> extends BaseCrudService<TEntity> {
  protected abstract addAccessCondition(
    user: UserContext,
    query: SelectQueryBuilder<TEntity>,
  ): SelectQueryBuilder<TEntity>;

  public async create(user: UserContext, model: TEntity): Promise<TEntity> {
    model.enabled = true;
    return await this.saveEntity(model, user.id);
  }

  public async all(user: UserContext): Promise<TEntity[]> {
    const query = this.repo.createQueryBuilder('GENERIC');
    const conditionQuery = this.addAccessCondition(user, query);

    return await conditionQuery.getMany();
  }

  public async delete(id: number, user: UserContext): Promise<TEntity> {
    const entity = await this.get(id, user);
    return await this.repo.remove(entity);
  }

  public async findAndCount<TRequest extends PageListInput>(
    user: UserContext,
    request: TRequest,
  ): Promise<PageList<TEntity>> {
    const skip = PaginationHelper.calculateOffset(
      request.page,
      request.pageSize,
    );

    const query = this.repo
      .createQueryBuilder('GENERIC')
      .skip(skip)
      .take(request.pageSize)
      .where('GENERIC.enabled = 1');

    const conditionQuery = this.addAccessCondition(user, query);
    const [results, count] = await conditionQuery.getManyAndCount();

    return { data: results, total: count };
  }

  public async get(id: number, user: UserContext): Promise<TEntity> {
    const query = this.repo
      .createQueryBuilder('GENERIC')
      .where('GENERIC.id = :id', { id });

    const conditionQuery = this.addAccessCondition(user, query);

    return await conditionQuery.getOne();
  }

  public async save(user: UserContext, model: TEntity): Promise<TEntity> {
    const result = !!model.id
      ? await this.update(user, model.id, model)
      : await this.create(user, model);
    return result;
  }

  public async update(
    user: UserContext,
    id: number,
    model: TEntity,
  ): Promise<TEntity> {
    const existsModel = await this.get(id, user);
    if (!!existsModel) {
      const data = { ...existsModel, ...model };
      return await this.saveEntity(data, user.id);
    }

    return null;
  }
}
