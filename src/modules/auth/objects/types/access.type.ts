import { Page } from '../enums';
import {
  CashActionType,
  CompanyActionType,
  UserActionType,
  InventoryActionType,
} from './action.type';

export type AccessType =
  | { page: Page.User; action: UserActionType }
  | { page: Page.Company; action: CompanyActionType }
  | { page: Page.Cash; action: CashActionType }
  | { page: Page.Inventory; action: InventoryActionType };
