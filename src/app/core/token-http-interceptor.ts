import { HttpInterceptorFn } from "@angular/common/http";

// Utility function to check if the code is running in the browser
const isBrowser = typeof window !== 'undefined';

export const tokenHttpInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;
  if (isBrowser) {
    token = localStorage.getItem("token");
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
