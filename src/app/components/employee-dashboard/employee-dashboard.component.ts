import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { HttpClient } from '@angular/common/http';


import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


interface WorkRecord {
  date: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  duration: number;
}

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent {

   employeeId: string | null = null;

 employeeName: any;

  constructor(
    @Inject(AuthService) public authService: AuthService,

    private http: HttpClient
  ) {
   
  }
}