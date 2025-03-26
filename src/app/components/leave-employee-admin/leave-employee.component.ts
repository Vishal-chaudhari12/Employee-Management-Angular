import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { SideBarComponent } from "../side-bar/side-bar.component";

interface LeaveRequest {
  _id: string;
  employeeId: string;
  email: string; // Added email property
  reason: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-leave',
  templateUrl: './leave-employee.component.html',
  styleUrl:'./leave-employee.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    SideBarComponent
],
})
export class LeaveComponent implements OnInit {
  displayedColumns: string[] = ['employee', 'email', 'reason', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  isAdmin: boolean = false;
  loading: boolean = false;
  newLeaveRequest: Partial<LeaveRequest> = {};

  authService = inject(AuthService);
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.isAdmin = await this.authService.isAdmin; // Assuming this returns a boolean
    this.getLeaveRequests();
  }
  loadEmployeeId() {
          const user = JSON.parse(localStorage.getItem('user')!); // Get logged-in user
          if (user && user._id) {
            this.newLeaveRequest.employeeId = user._id; // Set employee ID
          } else {
            Swal.fire('Error', 'User not found. Please log in again.', 'error');
          }
        }

  
  getLeaveRequests(): void {
    this.loading = true;
    const apiUrl = this.isAdmin
      ? 'http://localhost:3000/api/leave/all'
      : `http://localhost:3000/api/leave/${this.authService.getUserId()}`;

    this.http.get<LeaveRequest[]>(apiUrl).subscribe(
      (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching leave requests:', error);
        this.snackBar.open('Failed to fetch leave requests.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  confirmAction(leaveId: string, status: string): void {
    const formattedStatus = status.toLowerCase();

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark this leave as ${formattedStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${formattedStatus}`,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateLeaveStatus(leaveId, formattedStatus);
      }
    });
  }

  updateLeaveStatus(leaveId: string, status: string): void {
  this.http.put(`http://localhost:3000/api/leave/update/${leaveId}`, { status }).subscribe(
    (response: any) => {
      this.snackBar.open(`Leave marked as ${status}`, 'Close', { duration: 3000 });

      // Find and update the leave status in the local data
      const leaveIndex = this.dataSource.data.findIndex((leave) => leave._id === leaveId);
      if (leaveIndex !== -1) {
        this.dataSource.data[leaveIndex].status = status;
      }
      this.dataSource._updateChangeSubscription(); // Refresh the table

      this.getLeaveRequests(); // Fetch updated data
    },
    (error) => {
      console.error('Error updating leave:', error);
      Swal.fire('Error', 'Failed to update leave status', 'error');
    }
  );
}


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((request) => ({
      'Employee ID': request.employeeId,
      Email: request.email,
      Reason: request.reason,
      Date: request.date,
      Status: request.status.toUpperCase(),
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave Requests');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(data, 'Leave_Requests_Report.xlsx');
    this.snackBar.open('Excel report downloaded successfully!', 'Close', { duration: 3000 });
  }
}
