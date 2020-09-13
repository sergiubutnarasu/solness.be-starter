import { EntityRepository } from 'typeorm';
import { BaseRepository } from '~/modules/core';
import { RefreshToken } from './../objects';

@EntityRepository(RefreshToken)
export class AuthRepository extends BaseRepository<RefreshToken> {}
