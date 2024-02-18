// not-found-exception.filter.ts

import { ExceptionFilter, Catch, NotFoundException, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json({
      message: `Cannot ${request.method} ${request.url} available, please go to www.hotscup.com` ,
      error: 'Not Found',
      statusCode: 404,
    });
  }
}
