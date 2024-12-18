import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const mappedData = this.mapData(data);

        if (mappedData.status === false) {
          throw {
            status: false,
            statusCode: mappedData.statusCode || HttpStatus.BAD_REQUEST,
            message: mappedData.message || 'Something went wrong',
            error: mappedData.error || '',
          };
        }

        return {
          status: true,
          statusCode: mappedData.statusCode || HttpStatus.OK,
          message: mappedData.message || 'Success',
          data: mappedData.data || {},
        };
      }),
    );
  }

  private mapData(data: any) {
    if (!data) return data;

    if (data.status === false) {
      return {
        ...data,
        message: data.message ? `Error: ${data.message}` : 'An error occurred',
      };
    }

    return {
      ...data,
      data: data.data ? this.transformData(data.data) : {},
    };
  }

  private transformData(data: any) {
    return {
      ...data,
    };
  }
}
