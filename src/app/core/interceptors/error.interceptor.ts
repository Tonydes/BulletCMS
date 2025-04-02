// error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        router.navigate(['/notfound']);
      } else if (error.status >= 500) {
        console.error('Errore server:', error);
      } else if (error.status === 0) {
        console.error('Errore di connessione: server non raggiungibile');
      } else if (error.status === 403) {
        console.error('Non hai i permessi per accedere alla risorsa');
      } else if (error.status === 422) {
        console.error('Errore di validazione', error.error);
      }
      return throwError(() => error);
    })
  );
};
