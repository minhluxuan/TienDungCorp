import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const lang = request.query.lang || 'vi';
    if (request.body) {
        request.body.lang = lang;
    }
    
    return next.handle().pipe(map(data => data));
  }
}
