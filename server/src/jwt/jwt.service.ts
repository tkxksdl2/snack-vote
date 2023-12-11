import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

export enum TokenType {
  Access = 'ACCESS',
  Refresh = 'REFRESH',
}

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: JwtModuleOptions,
  ) {}

  sign(payload: object, type: TokenType): string {
    if (type === TokenType.Access) {
      return jwt.sign(payload, this.options.accessTokenKey, {
        expiresIn: this.options.accessTokenExpTime,
      });
    } else {
      return jwt.sign(payload, this.options.refreshTokenKey);
    }
  }

  verify(token: string, type: TokenType) {
    try {
      if (type === TokenType.Access) {
        return jwt.verify(token, this.options.accessTokenKey);
      } else {
        return jwt.verify(token, this.options.refreshTokenKey);
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        throw new GraphQLError('Expired Token', {
          extensions: { code: 'ACCEESS_TOKEN_EXPIRED' },
        });
      } else if (e instanceof jwt.JsonWebTokenError) {
        throw new GraphQLError('Token Corrupted', {
          extensions: { code: 'ACCEESS_TOKEN_CORRUPTED' },
        });
      }
      throw e;
    }
  }

  decode(token: string) {
    return jwt.decode(token);
  }

  verifyExpiredAccessToken(token: string) {
    return jwt.verify(token, this.options.accessTokenKey, {
      ignoreExpiration: true,
    });
  }
}
