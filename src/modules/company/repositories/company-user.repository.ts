import { EntityRepository } from 'typeorm';
import { BaseRepository } from '~/modules/core';
import { CompanyUser } from '../objects';

@EntityRepository(CompanyUser)
export class CompanyUserRepository extends BaseRepository<CompanyUser> {}
