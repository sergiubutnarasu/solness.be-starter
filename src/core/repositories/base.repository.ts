import {
  BaseEntity,
  PageListInput,
  PaginatedResponse,
  UserContext,
} from '../objects';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationHelper } from '../helpers';

export abstract class BaseRepository<
  TEntity extends BaseEntity,
> extends Repository<TEntity> {
  protected abstract addAccessCondition(
    query: SelectQueryBuilder<TEntity>,
    user: UserContext,
  ): SelectQueryBuilder<TEntity>;

  public async all(user: UserContext): Promise<TEntity[]> {
    const query = this.createQueryBuilder('GENERIC');
    const conditionQuery = this.addAccessCondition(query, user);

    return await conditionQuery.getMany();
  }

  public async findAndCountQueryBuilder<TRequest extends PageListInput>(
    request: TRequest,
    user: UserContext,
  ): Promise<PaginatedResponse<TEntity>> {
    const skip = PaginationHelper.calculateOffset(
      request.page,
      request.pageSize,
    );

    const query = this.createQueryBuilder('GENERIC')
      .skip(skip)
      .take(request.pageSize)
      .where('GENERIC.enabled = true');

    const conditionQuery = this.addAccessCondition(query, user);
    const [results, count] = await conditionQuery.getManyAndCount();

    return { data: results, total: count };
  }

  public async get(id: number, user: UserContext): Promise<TEntity> {
    const query = this.createQueryBuilder('GENERIC').where('GENERIC.id = :id', {
      id,
    });

    const conditionQuery = this.addAccessCondition(query, user);

    return await conditionQuery.getOne();
  }
}
