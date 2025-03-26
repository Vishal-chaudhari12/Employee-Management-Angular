import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  
})
export class SideBarComponent {
   isSidebarOpen = false;

   toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
   }
}
