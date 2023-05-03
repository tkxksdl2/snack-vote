import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JwtService, TokenType } from 'src/jwt/jwt.service';
import { UserService } from 'src/users/user.service';
import { AllowedRole } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const roles = this.reflector.get<AllowedRole>(
        'roles',
        context.getHandler(),
      );
      // 로그인 필요 없음
      if (!roles) return true;
      // 로그인 필요 - context에 유저 정보 저장됨
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const token = gqlContext['token'];
      if (token) {
        const payload = this.jwtService.verify(token, TokenType.Access);
        if (typeof payload === 'object' && payload.hasOwnProperty('id')) {
          const { user } = await this.userService.findOneById(payload.id);
          if (!user) return false;
          gqlContext['user'] = user;
          if (roles.includes('Any')) return true;
          return roles.includes(user.role);
        } else return false;
      } else if (roles.includes('Visitor')) return true;
      else return false;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new GraphQLError('Expired Token', {
          extensions: { code: 'ACCEESS_TOKEN_EXPIRED' },
        });
      } else if (e instanceof JsonWebTokenError) {
        throw new GraphQLError('Token Corrupted', {
          extensions: { code: 'ACCEESS_TOKEN_CORRUPTED' },
        });
      } else return false;
    }
  }
}
