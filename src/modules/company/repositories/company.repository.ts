import { EntityRepository } from 'typeorm';
import { BaseRepository } from '~/modules/core';
import { Company } from '../objects';

@EntityRepository(Company)
export class CompanyRepository extends BaseRepository<Company> {}
