import { EntityRepository } from 'typeorm';
import { BaseRepository } from '~/modules/core';
import { CashRegisterEntry } from '../objects';

@EntityRepository(CashRegisterEntry)
export class CashRegisterEntryRepository extends BaseRepository<CashRegisterEntry> {}
