import { BaseEntity } from '../objects';
import { Repository } from 'typeorm';

export class BaseRepository<T extends BaseEntity> extends Repository<T> {}
