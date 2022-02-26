import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Access, CurrentUser } from '~/modules/auth/decorators';
import { GraphQlAccessGuard, GraphQlAuthGuard } from '~/modules/auth/guards';
import { Page } from '~/modules/auth/objects';
import { composeResult, SimpleResponse, UserContext } from '~/modules/core';
import { CashRegisterEntry, CashRegisterEntryInput } from '../objects';
import { CashRegisterEntryService } from '../services';

@UseGuards(GraphQlAuthGuard, GraphQlAccessGuard)
@Resolver(() => CashRegisterEntry)
export class CashRegisterEntryResolver {
  constructor(private readonly service: CashRegisterEntryService) {}

  @Access({ page: Page.Cash, action: 'view' })
  @Query(() => [String], { name: 'cashRegisters' })
  public async getGrouped(@CurrentUser() user: UserContext) {
    const result = await this.service.getGrouped(user);

    return result;
  }

  @Access({ page: Page.Cash, action: 'view' })
  @Query(() => [CashRegisterEntry], { name: 'cashRegisterEntries' })
  public async getByDate(
    @CurrentUser() user: UserContext,
    @Args('date') date: Date,
  ) {
    const result = await this.service.getByDate(date, user);

    return result;
  }

  @Access({ page: Page.Cash, action: 'create' })
  @Mutation(() => SimpleResponse, { name: 'saveCashRegister' })
  public async saveEntries(
    @Args('entities', { type: () => [CashRegisterEntryInput] })
    entities: CashRegisterEntry[],
    @CurrentUser() user: UserContext,
  ) {
    await this.service.saveEntries(entities, user);

    return composeResult();
  }

  @Access({ page: Page.Cash, action: 'delete' })
  @Mutation(() => SimpleResponse, { name: 'deleteCashRegister' })
  public async deleteByDate(
    @Args('date') date: Date,
    @CurrentUser() user: UserContext,
  ) {
    await this.service.deleteByDate(date, user);

    return composeResult();
  }

  @Access({ page: Page.Cash, action: 'delete' })
  @Mutation(() => SimpleResponse, { name: 'deleteCashRegisterEntries' })
  public async deleteByIds(
    @Args('ids', { type: () => [Int] }) ids: number[],
    @CurrentUser() user: UserContext,
  ) {
    await this.service.deleteByIds(ids, user);

    return composeResult();
  }
}
