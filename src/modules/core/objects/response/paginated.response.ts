import { GenericResponse } from './generic.response';
import { BaseEntity } from '../entities';

export class PaginatedResponse<
  TItem extends BaseEntity
> extends GenericResponse<TItem[]> {
  public total: number;
}
