import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GraphQLFilter implements GqlExceptionFilter {
  catch(exception: QueryFailedError) {
    const message = exception.message;

    return new Error(message);
  }
}
