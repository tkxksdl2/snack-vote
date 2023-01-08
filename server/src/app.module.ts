import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
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
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'snackvoteAdmin',
      password: 'asfd3358644*',
      database: 'snackvote',
      synchronize: true,
      logging: true,
      entities: [User, Agenda, Opinion, RefreshTokens],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
