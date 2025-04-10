import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LeaveRequest {
  email: string;
  status: string;
  // Add other properties as needed
}
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}`; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Submit a new leave request
  submitLeave(leaveData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/leave`, leaveData);
  }

  // Fetch all leave requests (Admin)
  getAllLeaves(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Fetch employee's own leave requests
  getEmployeeLeaves(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Update leave request status (Admin)
  updateLeaveStatus(leaveId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${leaveId}`, { status });
  }

  getApprovedLeavesForUser(leaveRequests: LeaveRequest[], email: string): LeaveRequest[] {
    return leaveRequests.filter(leave => leave.email === email && leave.status === 'approved');
  }

}

