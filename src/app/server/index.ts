import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { Interceptor } from './interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
];
