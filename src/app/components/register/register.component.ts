import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, RouterLink]
})
export class RegisterComponent {
  user = { name: '', email: '', mobile: '', password: '', confirmPassword: '' };
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      Swal.fire('Error', 'Passwords do not match!', 'error');
      return;
    }

    this.loading = true;
    this.authService.register(this.user.name, this.user.email, this.user.mobile, this.user.password).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'OTP Sent!',
          text: 'An OTP has been sent to your email. Please verify to continue.',
          icon: 'info',
          timer: 3000,
          showConfirmButton: false
        });

        // Navigate to OTP verification page with email as a query parameter
        this.router.navigate(['/otp-verification'], { queryParams: { email: this.user.email } });
      },
      (error: any) => {
        Swal.fire('Error', error.error?.message || 'An error occurred while registering.', 'error');
      },
      () => {
        this.loading = false;
      }
    );
  }
}