
import { EmployeeModel } from '../../../../model/employee';
import { EmployeeService } from '../../services/employee.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';


@Component({
  selector: 'app-add-employee',
  imports: [FormsModule, CommonModule, SideBarComponent],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employee: EmployeeModel = new EmployeeModel();

  constructor(private employeeService: EmployeeService, private router: Router) {}

  onFileSelected(event: any, type: string) {
    const file: File = event.target.files[0];
    if (file) {
      if (type === 'marksheet') {
        this.employee.marksheet = file;
      } else if (type === 'resume') {
        this.employee.resume = file;
      }
    }
  }

  onSaveEmployee(): void {
    this.employeeService.saveEmployee(this.employee).subscribe(
      () => {
        Swal.fire({
          title: 'Success!',
          text: 'Employee saved successfully!',
          icon: 'success',
          timer: 2000, // Auto-close after 2 seconds
          showConfirmButton: false
        }).then(() => {
          // Redirect to the admin dashboard after alert closes
          this.router.navigate(['/admin-dashboard']);
        });
      },
      (error) => {
        console.error('Error saving employee', error);
        Swal.fire('Error!', 'Failed to save employee.', 'error');
      }
    );
  }
}