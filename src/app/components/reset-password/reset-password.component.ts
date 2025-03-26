
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [FormsModule],
})
export class ResetPasswordComponent {
  newPassword = '';
  token = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    // ✅ Get token from query params correctly
    this.route.params.subscribe(params => {
      this.token = params['token']; // Extract token from URL path
    });
  }

  resetPassword(event: Event) {
    event.preventDefault(); // ✅ Prevent default form submission
    console.log('token', this.token);
    

    if (!this.token) {
      Swal.fire('Error', 'Invalid or missing reset token.', 'error');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (res: any) => {
        Swal.fire('Success', res.message, 'success');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('API Error:', error);
        Swal.fire('Error', error.error?.message || 'An error occurred', 'error');
      }
    );
    
  }
}