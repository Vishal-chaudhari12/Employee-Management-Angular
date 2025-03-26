import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any[]>('http://localhost:3000/employee', { headers }).subscribe(
      (result) => {
        console.log("Employee data:", result);
        this.employeeList = result.map(employee => ({
          ...employee, 
          marksheetUrl: employee.marksheet ? 
          `http://localhost:3000/uploads/${employee.marksheet}` : null,
          resumeUrl: employee.resume ? `http://localhost:3000/uploads/${employee.resume}` : null
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
        this.http.delete(`http://localhost:3000/employee/${employeeId}`).subscribe(() => {
          Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
          this.getEmployees();
        });
      }
    });
  }
  
}