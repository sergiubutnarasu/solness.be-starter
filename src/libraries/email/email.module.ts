import { Module } from '@nestjs/common';
import { EmailService } from './services';

@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
