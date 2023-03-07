import { ApolloDriver } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './users/entities/user.entity';
import { UserModule } from './users/user.module';
import { JwtModule } from './jwt/jwt.module';
import { AgendaModule } from './agenda/agenda.module';
import { ConfigModule } from '@nestjs/config';
import { Agenda } from './agenda/entities/agenda.entity';
import { Opinion } from './agenda/entities/opinion.entity';
import { AuthModule } from './auth/auth.module';
import { RefreshTokens } from './users/entities/refresh-tokens.entity';
import { CommentsModule } from './comments/comments.module';
import { Comments } from './comments/entities/comments.entity';
import { UploadModule } from './upload/upload.module';
import { AppLoggerMiddleware } from './applogger/app-logger-middleware';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      context: ({ req, extra }) => {
        return { token: req ? req.headers['x-jwt'] : extra.token };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [User, Agenda, Opinion, RefreshTokens, Comments],
    }),
    JwtModule.forRoot({
      accessTokenKey: process.env.JWT_PRIVATE_KEY,
      accessTokenExpTime: process.env.JWT_PRIVATE_KEY_EXP_TIME,
      refreshTokenKey: process.env.JWT_REFRESH_KEY,
      refreshTokenExpTime: process.env.JWT_REFRESH_KEY_EXP_TIME,
    }),
    UserModule,
    AgendaModule,
    AuthModule,
    CommentsModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'dev')
      consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
