import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'register', renderMode: RenderMode.Prerender },
  { path: 'forgot-password', renderMode: RenderMode.Prerender },
  { path: 'reset-password', renderMode: RenderMode.Prerender },
  { path: 'otp-verification', renderMode: RenderMode.Server },

  // Add all other routes here:
  { path: 'admin-profile', renderMode: RenderMode.Server },
  { path: 'emp-profile', renderMode: RenderMode.Server },
  { path: 'admin-dashboard', renderMode: RenderMode.Server },
  { path: 'employee-dashboard', renderMode: RenderMode.Server },
  { path: 'employee-list', renderMode: RenderMode.Server },
  { path: 'add-employee', renderMode: RenderMode.Server },
  { path: 'checkIn', renderMode: RenderMode.Server },
  { path: 'leave-employee', renderMode: RenderMode.Server },
  { path: 'employee-leave-form', renderMode: RenderMode.Server },
  { path: 'side-bar', renderMode: RenderMode.Server },
];
