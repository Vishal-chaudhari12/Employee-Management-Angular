import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  
  
  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  openSidebar() {
    console.log("open");
    this.sidebarState.next(true);
  }

  closeSidebar() {
    console.log("closed");
    this.sidebarState.next(false);
  }

}
