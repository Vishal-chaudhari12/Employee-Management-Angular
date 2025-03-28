import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  imports: [MatToolbarModule, MatIconModule, RouterLink, CommonModule, MatMenuModule]
})
export class HeaderComponent {
  router = inject(Router);
  authService = inject(AuthService);
  isSidebarOpen = false;  // Sidebar state

  constructor( private location: Location) {}

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']).then(() => {
        // Replace history state to prevent back navigation
        this.location.replaceState('/login');
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}