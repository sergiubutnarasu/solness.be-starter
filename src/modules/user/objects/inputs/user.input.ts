import { InputType } from '@nestjs/graphql';
import { User } from '../entities';

@InputType()
export class UserInput extends User {}
