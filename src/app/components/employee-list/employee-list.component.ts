import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent {
  employeeList: any[] = [];
  selectedEmployee: any = null;

  constructor(private http: HttpClient) {}

  getEmployees() {
    console.log("Fetching employees...");

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    this.http.get<any[]>(`${environment.apiUrl}/employee`, { headers }).subscribe(
      (result) => {
        console.log("Employee data:", result);
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

  viewEmployeeDetails(employee: any) {
    this.selectedEmployee = employee;
  }

  viewDocument(filePath: string) {
    if (!filePath) {
      Swal.fire('Error', 'Document not found!', 'error');
      return;
    }
    window.open(filePath, "_blank");
  }

  onEdit(employee: any) {
    // Handle edit logic
  }

  onDelete(employeeId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // 🔹 Send auth token
        };
  
        this.http.delete(`${environment.apiUrl}/employee/${employeeId}`, { headers }).subscribe(() => {
          Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
          this.getEmployees();
        }, (error) => {
          Swal.fire('Error!', 'Failed to delete employee.', 'error');
        });
      }
    });
  }
  
}