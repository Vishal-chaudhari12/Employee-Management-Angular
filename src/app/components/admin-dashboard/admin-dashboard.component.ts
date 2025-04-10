import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [MatIcon, CommonModule, RouterModule, SideBarComponent,MatCardModule]
})
export class AdminDashboardComponent implements OnInit {
  allLeaveRequests: any[] = [];
  employeeList: any[] = [];
  selectedEmployee: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchLeaveRequests();
    this.getEmployees();
  }


  fetchLeaveRequests() {
    this.http.get<any[]>(`${environment.apiUrl}/api/leave/all`).subscribe({
      next: (data) => {
        console.log('Fetched leave requests:', data); // Debugging
        this.allLeaveRequests = data;
      },
      error: (error) => {
        console.error('Error fetching leave requests:', error);
        Swal.fire('Error', 'Failed to fetch leave requests.', 'error');
      }
    });
  }
  
  // Update leave request status (Approve/Reject)
  updateLeaveStatus(leaveId: string, status: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${status.toLowerCase()} this leave request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`/api/leave/update/${leaveId}`, { status }).subscribe(
          () => {
            Swal.fire('Updated!', `Leave request has been ${status.toLowerCase()}.`, 'success');
            this.fetchLeaveRequests(); // Refresh the leave list after update
          },
          (error) => {
            console.error('Error updating leave status', error);
            Swal.fire('Error', 'Failed to update leave request.', 'error');
          }
        );
      }
    });
  }
  
  getEmployees() {
    console.log("Fetching employees...");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    this.http.get<any[]>(`${environment.apiUrl}/employee`, { headers }).subscribe(
      (result) => {
        console.log("Employee data:", result);
        this.employeeList = result;
        this.employeeList = result.map(employee => ({
          ...employee, 
          
          marksheetUrl: employee.marksheet ? 
          `${environment.apiUrl}/uploads/${employee.marksheet}` : null,
          resumeUrl: employee.resume ? `${environment.apiUrl}/uploads/${employee.resume}` : null
        }));
      },
      (error) => {
        console.error("Error fetching employees:", error);
      }
    );
  }
}


