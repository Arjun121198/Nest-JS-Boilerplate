import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class BrandaccountInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        context.switchToHttp().getResponse().status(200);
        return { statusCode: 200, message: 'Success', data: response };
      }),
      catchError((error) => {
        context.switchToHttp().getResponse().status(500);
        return of({
          statusCode: 500,
          message: error.message || 'Internal Server Error',
          error: error,
        });
      })
    );
  }
}
