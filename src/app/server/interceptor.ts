import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(map(
      event => {
        if (event instanceof HttpResponse) {
          if (event.type === HttpEventType.Response) {
            if (event.body.code === '802.00408') {
              return event.clone({
                body: {
                  code: '0',
                  result: []
                }
              });
            }
            
          }
        }

        return event;

      }
    ))
  }
}