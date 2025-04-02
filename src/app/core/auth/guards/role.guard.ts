import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const user = authService.getCurrentUser();

  if (user && user.role === requiredRole) {
    return true;
  } else {
    router.navigate(['/not-authorized']);
    return false;
  }
};
