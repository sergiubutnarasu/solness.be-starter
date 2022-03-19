import { InputType } from '@nestjs/graphql';
import { BasePageListInput } from './base-page-list.input';

@InputType()
export class PageListInput extends BasePageListInput {}
