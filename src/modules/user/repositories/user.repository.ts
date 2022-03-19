import { EntityRepository } from 'typeorm';
import { SharedUserRepository, User } from '~/shared/user';

@EntityRepository(User)
export class UserRepository extends SharedUserRepository {}
