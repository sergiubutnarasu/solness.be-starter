import { InputType, OmitType } from '@nestjs/graphql';
import { User } from '../entities';

/**
 * This class is needed to use OmitType and fixing the generating error
 */
@InputType({ isAbstract: true })
export class CreateUserInput extends User {}

@InputType()
export class UserInput extends OmitType(CreateUserInput, ['role'] as const) {}
