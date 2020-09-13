import { EntityRepository } from 'typeorm';
import { BaseRepository } from '~/modules/core';
import { User } from '../objects';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
