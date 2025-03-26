import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { SideBarComponent } from "../side-bar/side-bar.component";

@Component({
  selector: 'app-leave',
  templateUrl: './employee-leave.component.html',
  styleUrls: ['./employee-leave.component.css'], // Ensure this file exists
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule]
})

export class EmployeeleaveComponent implements OnInit {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  newLeaveRequest = {
    email: '',
    type: '',
    reason: '',
    fromDate: '',
    toDate: '',
    status: 'pending',
  };

  leaveTypes: string[] = ['Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paid Leave'];
  leaveRequests: any[] = [];
  totalLeaves = 20; // Total yearly leaves
  approvedLeaves = 0; // Leaves that are approved
  remainingLeaves = 20; // Remaining leaves
  searchQuery = '';
  statusFilter = '';
  sortColumn = '';

  ngOnInit() {
    console.log('Component initialized, loading user details...');
    this.loadUserDetails();
    this.loadEmployeeLeaveRequests();
  }
  
  loadUserDetails() {
    if (typeof window === 'undefined') {
      return;
    }
  
    const userString = localStorage.getItem('loginUser');

    if (!userString) {
      console.warn('No user data found in localStorage.');
      this.snackBar.open('User not logged in. Please log in first.', 'Close', { duration: 3000 });
      return;
    }

    try {
      const user = JSON.parse(userString);

      if (user && user.email) {
        this.newLeaveRequest.email = user.email;
        console.log('User email loaded:', user.email);
      } else {
        console.warn('Invalid user data in localStorage.');
        this.snackBar.open('Invalid user details. Please log in again.', 'Close', { duration: 3000 });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.snackBar.open('Error retrieving user data. Please log in again.', 'Close', { duration: 3000 });
    }
  }

  submitLeaveRequest() {
    if (!this.newLeaveRequest.email) {
      this.snackBar.open('User email is missing. Please log in again.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.newLeaveRequest.reason || !this.newLeaveRequest.fromDate || !this.newLeaveRequest.toDate || !this.newLeaveRequest.type) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }
      
      if (this.newLeaveRequest.reason.length < 10) {
        this.snackBar.open('Reason must be at least 10 characters long.', 'Close', { duration: 3000 });
        return;
      }
  
     
      const today = new Date();
      const fromDate = new Date(this.newLeaveRequest.fromDate);
      const toDate = new Date(this.newLeaveRequest.toDate);
  
      if (fromDate < today) {
        this.snackBar.open('From Date must be today or a future date.', 'Close', { duration: 3000 });
        return;
      }
  
      if (toDate < fromDate) {
        this.snackBar.open('To Date must be on or after the From Date.', 'Close', { duration: 3000 });
        return;
      }

    const leaveData = {
      email: this.newLeaveRequest.email,
      type: this.newLeaveRequest.type,
      reason: this.newLeaveRequest.reason,
      fromDate: this.newLeaveRequest.fromDate,
      toDate: this.newLeaveRequest.toDate,
      status: 'pending'
    };

    this.http.post('http://localhost:3000/api/leave', leaveData).subscribe(
      () => {
        this.snackBar.open('Leave request submitted successfully!', 'Close', { duration: 3000 });
        this.newLeaveRequest = {
          email: this.newLeaveRequest.email, 
          type: '',
          reason: '',
          fromDate: '',
          toDate: '',
          status: 'pending'
        };
        this.loadEmployeeLeaveRequests();
      },
      (error) => {
        console.error('Error submitting leave request:', error);
        this.snackBar.open('Failed to submit leave request', 'Close', { duration: 3000 });
      }
    );
  }

  loadEmployeeLeaveRequests() {
    console.log('Fetching leave requests for:', this.newLeaveRequest.email);
  
    if (!this.newLeaveRequest.email) {
      this.snackBar.open('User email is missing. Cannot fetch leave requests.', 'Close', { duration: 3000 });
      return;
    }
  
    this.http.get<any[]>(`http://localhost:3000/api/leave/employee/${this.newLeaveRequest.email}`)
      .subscribe(
        (data) => {
          console.log('Leave requests received:', data);
          this.leaveRequests = data;
          this.calculateApprovedLeaves(this.newLeaveRequest.email);
        },
        (error) => {
          console.error('Error fetching leave requests:', error);
        }
      );
  }

  calculateApprovedLeaves(loggedInUserEmail: string) {
    if (!this.leaveRequests || !Array.isArray(this.leaveRequests)) {
      return;
    }
  
    const officialHolidays = ['2024-01-01', '2024-12-25']; // Example public holidays
    const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6; // Sunday(0) & Saturday(6)
  
    this.approvedLeaves = this.leaveRequests
      .filter(leave => 
        leave.email?.trim().toLowerCase() === loggedInUserEmail.trim().toLowerCase() &&
        leave.status?.trim().toLowerCase() === "approved"
      )
      .reduce((total, leave) => {
        if (!leave.fromDate || !leave.toDate) return total;
  
        let fromDate = new Date(leave.fromDate);
        let toDate = new Date(leave.toDate);
  
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return total;
  
        let leaveDays = 0;
        while (fromDate <= toDate) {
          const dateStr = fromDate.toISOString().split('T')[0];
          if (!isWeekend(fromDate) && !officialHolidays.includes(dateStr)) {
            leaveDays++;
          }
          fromDate.setDate(fromDate.getDate() + 1);
        }
  
        return total + leaveDays;
      }, 0);
  
    this.remainingLeaves = Math.max(0, this.totalLeaves - this.approvedLeaves);
  }
  
  filteredLeaveRequests() {
    return this.leaveRequests
      .filter((leave) => {
        return (
          (!this.searchQuery ||
            leave.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            leave.status.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
          (!this.statusFilter || leave.status === this.statusFilter)
        );
      })
      .sort((a, b) => {
        if (!this.sortColumn) return 0;
        return a[this.sortColumn] > b[this.sortColumn] ? 1 : -1;
      });
  }

  sortBy(column: string) {
    this.sortColumn = column;
  }
}