import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
export class LangInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let lang: string;

    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      lang = req.headers['lang'] || req.headers['accept-language'] || 'vi';
      req.lang = lang;
    } else if (context.getType() === 'rpc') {
      const rpcContext = context.switchToRpc();
      const originalData = rpcContext.getData();
      lang = originalData.lang || 'vi';

      rpcContext.getData = <T>() => {
        const data = originalData as T;
        if (typeof data === 'object' && data !== null) {
          return { ...data, lang } as T;
        }
        return { data, lang } as unknown as T;
      };
    }

    return next.handle().pipe(
      tap(() => { }),
    );
  }
}