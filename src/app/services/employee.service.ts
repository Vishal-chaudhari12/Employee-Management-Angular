import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employee`;

  constructor(private http: HttpClient) {}

  saveEmployee(employee: any): Observable<any> {
    const formData = new FormData();
    
    Object.keys(employee).forEach(key => {
      if (employee[key] !== null) {
        formData.append(key, employee[key]);
      }
    });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // 🔹 Ensure token is included
    });

    return this.http.post<any>(this.apiUrl, formData, { headers });
  }
}
