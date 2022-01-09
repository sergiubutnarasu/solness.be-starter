import { SetMetadata } from '@nestjs/common';
import { AccessType } from '../objects';

export const Access = (access: AccessType) => SetMetadata('access', access);
