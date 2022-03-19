import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository, UserContext } from '~/core';
import { RefreshToken } from './../objects';

@EntityRepository(RefreshToken)
export class AuthRepository extends BaseRepository<RefreshToken> {
  protected addAccessCondition(
    query: SelectQueryBuilder<RefreshToken>,
    _user: UserContext,
  ): SelectQueryBuilder<RefreshToken> {
    return query;
  }
}
