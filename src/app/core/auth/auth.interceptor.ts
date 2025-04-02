// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (authService.isLoggedIn()) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(newAuthReq);
            }),
            catchError((refreshError) => {
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};
