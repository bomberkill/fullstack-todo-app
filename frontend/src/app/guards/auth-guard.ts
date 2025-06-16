import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const authToken = localStorage.getItem('authToken');
  const platformId = inject(PLATFORM_ID)
  let authToken: string | null = null

  if (isPlatformBrowser(platformId)) {
    authToken = localStorage.getItem("authToken")
    if (authToken) {
      return true
    }
  };

  router.navigate(["/login"]);
  return false;
};
