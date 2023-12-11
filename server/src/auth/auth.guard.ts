import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
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
      const roles = this.getApiRoles(context);
      // 로그인 필요 없음
      if (!roles) return true;

      // 이하 로그인 필요
      const gqlContext =
        GqlExecutionContext.create(context).getContext<object>();
      const token: string = gqlContext['token'];

      //context에 유저 정보 저장
      const setContextResult = await this.setUserInGqlContextAndReturnBool(
        token,
        gqlContext,
      );

      return (
        // 유저를 찾는데 성공하고 role이 적합하거나, 유저를 찾지 못해도 Visitor인 경우 통과
        (setContextResult &&
          (roles.includes(gqlContext['user'].role) || roles.includes('Any'))) ||
        roles.includes('Visitor')
      );
    } catch (e) {
      if (e instanceof GraphQLError) throw e;
      return false;
    }
  }

  getApiRoles(context: ExecutionContext): AllowedRole {
    return this.reflector.get<AllowedRole>('roles', context.getHandler());
  }

  // token으로 유저를 찾고 gqlContext에 저장하고 성공 여부를 반환
  async setUserInGqlContextAndReturnBool(
    token: string,
    gqlContext: object,
  ): Promise<boolean> {
    if (!token) return false;

    const payload = this.jwtService.verify(token, TokenType.Access);
    if (typeof payload !== 'object' || !payload.hasOwnProperty('id'))
      return false;

    const { user } = await this.userService.findOneById(payload.id);
    if (!user) return false;

    gqlContext['user'] = user;
    return true;
  }
}
