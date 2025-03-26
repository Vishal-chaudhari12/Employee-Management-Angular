import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-emp-profile',
  imports: [],
  templateUrl: './emp-profile.component.html',
  styleUrl: './emp-profile.component.css'
})
export class EmpProfileComponent {
  authService = inject(AuthService);
}
