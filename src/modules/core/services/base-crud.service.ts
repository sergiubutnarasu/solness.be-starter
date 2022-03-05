import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial } from 'typeorm';
import { BaseEntity } from '../objects';
import { BaseRepository } from '../repositories';

export abstract class BaseCrudService<
  TEntity extends BaseEntity,
> extends TypeOrmCrudService<TEntity> {
  protected repo: BaseRepository<TEntity>;
  constructor(repository: BaseRepository<TEntity>) {
    super(repository);
    this.repo = repository;
  }

  protected async saveEntity(
    model: DeepPartial<TEntity>,
    userId: number,
  ): Promise<TEntity> {
    return await this.repo.save(model, { data: { userId } });
  }

  protected async saveEntities(
    entities: DeepPartial<TEntity>[],
    userId: number,
  ): Promise<TEntity[]> {
    return await this.repo.save(entities, { data: { userId } });
  }
}
