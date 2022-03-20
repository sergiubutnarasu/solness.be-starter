import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth';
import { CashRegisterModule } from './modules/cash-register';
import { CompanyModule } from './modules/company';
import { AppConfigKey, AppHelper, CommonSubscriber, Environment } from './core';
import { UserModule } from './modules/user';
import { ViewerModule } from './modules/viewer';
import { DataLoaderModule, DataLoaderService } from './shared/data-loader';

const appModules = [
  AuthModule,
  ViewerModule,
  UserModule,
  CompanyModule,
  CashRegisterModule,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [DataLoaderService],
      useFactory: (dataLoaderService: DataLoaderService) => {
        return {
          autoSchemaFile: 'schema.gql',
          context: ({ req }) => ({
            req,
            loaders: dataLoaderService.createLoaders(),
          }),
          cors: {
            origin: AppHelper.getConfig(AppConfigKey.DefaultLink),
            credentials: true,
          },
          debug: AppHelper.checkEnvironment(Environment.Development),
          playground: AppHelper.checkEnvironment(Environment.Development)
            ? { settings: { 'request.credentials': 'include' } }
            : false,
        };
      },
    }),
    ...appModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
