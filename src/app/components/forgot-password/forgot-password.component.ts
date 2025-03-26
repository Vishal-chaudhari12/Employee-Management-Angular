
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports:[FormsModule]
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.authService.forgotPassword(this.email).subscribe(
      (res: any) => {
        Swal.fire('Success', res.message, 'success');
      },
      (error) => {
        Swal.fire('Error', error.error?.message || 'Something went wrong', 'error');
      },
      () => {
        this.loading = false;
      }
    );
  }
}