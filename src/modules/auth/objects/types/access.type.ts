import { Page } from '../enums';
import { CompanyActionType, UserActionType } from './action.type';

export type AccessType =
  | { page: Page.User; action: UserActionType }
  | { page: Page.Company; action: CompanyActionType };
