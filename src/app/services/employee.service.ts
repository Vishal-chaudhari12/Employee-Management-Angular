import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employee';

  constructor(private http: HttpClient) {}

  saveEmployee(employee: any): Observable<any> {
    const formData = new FormData();
    
    Object.keys(employee).forEach(key => {
      if (employee[key] !== null) {
        formData.append(key, employee[key]);
      }
    });

    return this.http.post<any>(this.apiUrl, formData);
  }

  
}