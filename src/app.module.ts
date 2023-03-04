import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CommonModule } from './common/common.module';
import { appConfig } from './config/app-config';
import { AuthModule } from './modules/auth/auth.module';
import AccessTokenGuard from './modules/auth/guards/access-token.guard';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get('database.username'),
          password: configService.get('database.password'),
          database: configService.get('database.dbname'),
          logging: configService.get<Array<string>>('database.logLevel'),
          entities: configService.get<Array<string>>('database.entities'),
          autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
          synchronize: configService.get<boolean>('database.synchronize'),
          // dropSchema: configService.get<boolean>('database.dropSchema'),
        } as PostgresConnectionOptions),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    CommonModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AccessTokenGuard }],
})
export class AppModule {}
