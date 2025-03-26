
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
  imports: [FormsModule,CommonModule],
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  email: string = '';
  otp: string = '';
  otpExpiryTime: number = 10 * 60; // 10 minutes in seconds
  interval: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get email from query params
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });

    // Start countdown
    this.startOtpCountdown();
  }

  startOtpCountdown() {
    this.interval = setInterval(() => {
      if (this.otpExpiryTime > 0) {
        this.otpExpiryTime--;
      } else {
        clearInterval(this.interval);
        Swal.fire('Error', 'Your OTP has expired. Please request a new one.', 'error');
        this.router.navigate(['/register']); // Redirect to registration for a new OTP
      }
    }, 1000);
  }

  // Format time for display
  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const sec: number = seconds % 60;
    return `${minutes}:${sec < 10 ? '0' : ''}${sec}`;
  }

  verifyOTP() {
    if (this.otpExpiryTime <= 0) {
      Swal.fire('Error', 'Your OTP has expired. Please request a new one.', 'error');
      return;
    }

    Swal.fire({
      title: 'Verifying OTP...',
      text: 'Please wait while we confirm your OTP',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.authService.verifyOtp(this.email, this.otp).subscribe(
      (res: any) => {
        clearInterval(this.interval);
        Swal.fire({
          title: 'Success!',
          text: 'OTP Verified Successfully. Redirecting to login...',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error: any) => {
        Swal.fire('Error', error.error?.message || 'Invalid OTP. Please try again.', 'error');
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Prevent memory leaks
  }
}