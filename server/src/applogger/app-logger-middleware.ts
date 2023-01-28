import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { GraphQLRequest } from 'apollo-server-types';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('graphql');
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, url } = request;
    const { body }: { body: GraphQLRequest } = request;
    response.on('close', () => {
      this.logger.log(
        `method-${method} url-${url} operationName-${body.operationName}`,
      );
    });

    next();
  }
}
