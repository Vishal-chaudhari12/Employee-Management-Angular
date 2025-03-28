import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  
  
  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar() {
    this.sidebarState.next(!this.sidebarState.value);
  }

  openSidebar() {
    console.log("open");
    this.sidebarState.next(true);
  }

  closeSidebar() {
    console.log("closed");
    this.sidebarState.next(false);
  }

}
