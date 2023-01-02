import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './users/entities/user.entity';
import { UserModule } from './users/user.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
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
      entities: [User],
    }),
    JwtModule.forRoot({ privateKey: 'sfasfasdfseresfs#$' }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
