import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { environment } from '../../../environments/environment.prod';

interface LeaveRequest {
  _id: string;
  email: string;
  reason: string;
  fromDate: string;
  toDate: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-leave',
  templateUrl: './leave-employee.component.html',
  styleUrl: './leave-employee.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
  ],
})
export class LeaveComponent implements OnInit {
  displayedColumns: string[] = ['email', 'reason', 'fromDate', 'toDate', 'type', 'status', 'actions'];
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  isAdmin: boolean = false;
  loading: boolean = false;

  authService = inject(AuthService);
  http = inject(HttpClient);
  snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.isAdmin = await this.authService.isAdmin;
    this.getLeaveRequests();
  }

  getLeaveRequests(): void {
    this.loading = true;
    const userEmail = this.authService.userEmail;

    const apiUrl = this.isAdmin
      ? `${environment.apiUrl}/api/leave/all`
      :` ${environment.apiUrl}/api/leave/employee/${userEmail}`;

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
    Swal.fire({
      title: 'Are you sure?',
      text:` Do you want to mark this leave as ${status}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateLeaveStatus(leaveId, status);
      }
    });
  }

  updateLeaveStatus(leaveId: string, status: string): void {
    this.http.put(`http://localhost:3000/api/leave/update/${leaveId}`, { status }).subscribe(
      () => {
        this.snackBar.open(`Leave marked as ${status}`, 'Close', { duration: 3000 });
        this.getLeaveRequests(); // Refresh data
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
      Email: request.email,
      Reason: request.reason,
      FromDate: request.fromDate,
      ToDate: request.toDate,
      Type: request.type,
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