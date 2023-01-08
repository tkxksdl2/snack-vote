import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokens } from './entities/refresh-tokens.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshTokens])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
