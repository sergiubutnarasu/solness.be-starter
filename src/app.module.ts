import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth';
import { CompanyModule } from './modules/company';
import {
  AppConfigKey,
  AppHelper,
  CommonSubscriber,
  Environment,
} from './modules/core';
import { UserModule } from './modules/user';
import { ViewerModule } from './modules/viewer';

const appModules = [AuthModule, ViewerModule, UserModule, CompanyModule];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: AppHelper.getConfig(AppConfigKey.DatabaseHost),
      database: AppHelper.getConfig(AppConfigKey.DatabaseName),
      username: AppHelper.getConfig(AppConfigKey.DatabaseUser),
      password: AppHelper.getConfig(AppConfigKey.DatabasePassword),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsRun: true,
      migrations: [__dirname + '/**/*.migration{.ts,.js}'],
      cli: {
        migrationsDir: __dirname + 'migration',
      },
      subscribers: [CommonSubscriber],
      logging: AppHelper.checkEnvironment(Environment.Development),
    }),
    GraphQLModule.forRoot({
      debug: AppHelper.checkEnvironment(Environment.Development),
      playground: AppHelper.checkEnvironment(Environment.Development),
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      cors: {
        origin: AppHelper.getConfig(AppConfigKey.DefaultLink),
        credentials: true,
      },
    }),
    ...appModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
