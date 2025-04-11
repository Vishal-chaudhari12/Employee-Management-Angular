import { Component, inject, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    MatMenuModule,
    RouterOutlet
  ]
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  isSidebarOpen = true;  // Sidebar state

  @HostListener('document:keydown.escape')
  onKeydownHandler() {
    this.closeSidebar();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

