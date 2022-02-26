import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeepPartial, Repository } from 'typeorm';

export abstract class BaseCrudService<T> extends TypeOrmCrudService<T> {
  protected repo: Repository<T>;
  constructor(repository: Repository<T>) {
    super(repository);
    this.repo = repository;
  }

  protected async saveEntity(
    model: DeepPartial<T>,
    userId: number,
  ): Promise<T> {
    return await this.repo.save(model, { data: { userId } });
  }

  protected async saveEntities(
    entities: DeepPartial<T>[],
    userId: number,
  ): Promise<T[]> {
    return await this.repo.save(entities, { data: { userId } });
  }
}
