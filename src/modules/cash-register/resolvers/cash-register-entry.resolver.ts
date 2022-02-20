import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { CashRegisterEntry } from '../objects';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard)
@Resolver(() => CashRegisterEntry)
export class CashRegisterEntryResolver {}
