import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from "../side-bar/side-bar.component";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [MatIcon, CommonModule, RouterModule, SideBarComponent]
})
export class AdminDashboardComponent implements OnInit {
  allLeaveRequests: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests() {
    this.http.get<any[]>('http://localhost:3000/api/leave/all').subscribe({
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
}


