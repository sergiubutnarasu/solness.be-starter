import { BaseEntity } from '../entities';

export class PaginatedResponse<TItem extends BaseEntity> {
  public data?: TItem[];
  public total: number;
}
