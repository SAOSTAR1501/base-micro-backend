import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RpcExceptionInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(err => {
                this.logger.error('💥Error RpcExceptionInterceptor💥', err.stack || err);

                if (err instanceof HttpException) {
                    return throwError(() => err);
                }

                const errorResponse = {
                    success: false,
                    statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                    message: err.message || 'Internal server error',
                    error: err.error || undefined,
                    data: err.data || undefined
                };

                if (err.statusCode === HttpStatus.BAD_REQUEST) {
                    errorResponse.statusCode = HttpStatus.BAD_REQUEST;
                    errorResponse.error = errorResponse.error || 'Bad Request';
                } else if (!err.statusCode || err.statusCode < 400 || err.statusCode >= 600) {
                    errorResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
                    errorResponse.message = 'Internal server error';
                }

                return throwError(() => new HttpException(errorResponse, errorResponse.statusCode));
            }),
        );
    }
}


