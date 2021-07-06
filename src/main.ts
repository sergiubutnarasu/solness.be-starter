import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigKey, AppHelper, GraphQLFilter } from './modules/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GraphQLFilter());
  app.enableCors({
    credentials: true,
    origin: AppHelper.getConfig(AppConfigKey.DefaultLink),
  });

  await app.listen(5000);
}

bootstrap();
