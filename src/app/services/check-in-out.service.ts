import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CheckInOutService {
  constructor(private http: HttpClient) {}

  checkIn(employeeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/check-in-out/check-in`, { employeeId });
  }

  checkOut(employeeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/check-in-out/check-out`, { employeeId });
  }

  pauseWork(employeeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/check-in-out/pause`, { employeeId });
  }

  resumeWork(employeeId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/check-in-out/resume`, { employeeId });
  }

  getWorkHistory(employeeId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/check-in-out/history/${employeeId}`);
  }
}
