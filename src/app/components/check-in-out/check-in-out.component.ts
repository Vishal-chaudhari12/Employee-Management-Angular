import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';

import { CheckInOutService } from '../../services/check-in-out.service';

import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { RouterLink } from '@angular/router';
import { SideBarComponent } from "../side-bar/side-bar.component";
import Swal from 'sweetalert2';

interface WorkRecord {
  date: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  duration: number;
}

@Component({
  selector: 'app-check-in-out',
  imports: [CommonModule, FormsModule, SideBarComponent],
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.css']
})
export class CheckInOutComponent{
isCheckedIn: boolean = false;
  lastCheckIn: Date | null = null;
  lastCheckOut: Date | null = null;
  elapsedTime: number = 0;
  timer: any;
  employeeId: string | null = null;
  workRecords: WorkRecord[] = [];
  showTotalHoursView: boolean = false;
  totalWorkingHours: number = 0;
  selectedMonth: string = '';
  months: string[] = [];
  filteredWorkRecords: WorkRecord[] = [];
  isPaused: boolean | undefined;

  constructor(
    @Inject(AuthService) public authService: AuthService,
    private checkInOutService: CheckInOutService,
    private http: HttpClient
  ) {
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYearStr = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      this.months.push(monthYearStr);
    }
    this.selectedMonth = this.months[0]; // Set default to current month
  }

  ngOnInit() {
    this.employeeId = this.authService.userId;
    if (!this.employeeId) {
      console.error("Employee ID is missing!");
      return;
    }
    this.fetchWorkRecords();
  }

  generateMonthsList() {
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      this.months.push(monthDate.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    this.selectedMonth = this.months[0]; // Default to current month
  }

  startStopwatch() {
    if (!this.isCheckedIn) {
      this.checkIn();
    }
    this.timer = setInterval(() => {
      this.elapsedTime += 1000;
    }, 1000);
  }
  stopStopwatch() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to stop working?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, stop work!'
    }).then((result) => {
      if (result.isConfirmed) {
        clearInterval(this.timer);
        if (this.isCheckedIn) {
          this.checkOut();
          Swal.fire('Stopped!', 'Your work session has ended.', 'success');
        }
      }
    });
  }
  

  checkIn() {
    if (!this.employeeId) return;

    this.checkInOutService.checkIn(this.employeeId).subscribe(
      (res: any) => {
        this.isCheckedIn = true;
        this.lastCheckIn = new Date();
        this.elapsedTime = 0;
        this.fetchWorkRecords(); // Refresh work records after check-in
      },
      (error) => console.error(error)
    );
  }

  checkOut() {
    if (!this.employeeId) return;

    this.checkInOutService.checkOut(this.employeeId).subscribe(
      (res: any) => {
        this.isCheckedIn = false;
        this.lastCheckOut = new Date();
        this.fetchWorkRecords(); // Refresh work records after check-out
      },
      (error) => console.error(error)
    );
  }

  pauseWork() {
    if (!this.employeeId) return;

    this.checkInOutService.pauseWork(this.employeeId).subscribe(
      () => {
        this.isPaused = true;
        clearInterval(this.timer);
      },
      (error) => console.error(error)
    );
  }

  resumeWork() {
    if (!this.employeeId) return;

    this.checkInOutService.resumeWork(this.employeeId).subscribe(
      () => {
        this.isPaused = false;
        this.startStopwatch();
      },
      (error) => console.error(error)
    );
  }

  
  fetchWorkRecords() {
    if (!this.employeeId) return;
  
    this.http.get(`${environment.apiUrl}/api/check-in-out/history/${this.employeeId}`).subscribe(
      (res: any) => {
        console.log("History API Response:", res); // Debugging
        if (res.history) {
          this.workRecords = res.history.map((record: any) => {
            const checkInTime = new Date(record.checkInTime);
            const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null;
  
            let duration;
            if (checkOutTime) {
              duration = this.formatTime(this.elapsedTime);
            } else if (this.isCheckedIn) {
              // Calculate ongoing work duration
              duration = new Date().getTime() - checkInTime.getTime();
            } else {
              duration = 0;
            }
  
            return {
              date: checkInTime.toISOString().split('T')[0],
              checkInTime,
              checkOutTime,
              duration
            };
          });
  
          this.filterWorkRecordsByMonth();
        } else {
          this.workRecords = [];
          this.filteredWorkRecords = [];
          this.totalWorkingHours = 0;
        }
      },
      (error) => console.error("Error fetching history:", error)
    );
  }
  

  formatTime(milliseconds: number): string {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  viewTotalHours() {
    this.showTotalHoursView = true;
    this.calculateTotalWorkingHours();
  }

  hideTotalHours() {
    this.showTotalHoursView = false;
  }

  calculateTotalWorkingHours() {
    this.totalWorkingHours = this.filteredWorkRecords.reduce((total, record) => {
      return total + record.duration;
    }, 0);
  }

  onMonthChange(newMonth: string) {
    this.selectedMonth = newMonth;
    this.filterWorkRecordsByMonth();
  }

  filterWorkRecordsByMonth() {
    const [monthStr, yearStr] = this.selectedMonth.split(' ');
    const month = new Date(Date.parse(monthStr + " 1, " + yearStr)).getMonth();
    const year = parseInt(yearStr, 10);

    this.filteredWorkRecords = this.workRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month && recordDate.getFullYear() === year;
    });
    this.calculateTotalWorkingHours();
  }

  downloadMonthlyRecord() {
    if (!this.filteredWorkRecords.length) {
      alert('No records found for the selected month.');
      return;
    }
  
    const csvRows: string[][] = [];
    csvRows.push(['Date', 'Check-In Time', 'Check-Out Time', 'Duration (HH:MM:SS)']); // Header row
  
    this.filteredWorkRecords.forEach(record => {
      const formattedDate = new Date(record.checkInTime).toISOString().split('T')[0]; // Ensure proper date formatting
      const formattedCheckInTime = record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A';
      const formattedCheckOutTime = record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'Pending';
      const formattedDuration = record.checkOutTime ? this.formatTime(record.duration) : 'In Progress';
  
      csvRows.push([formattedDate, formattedCheckInTime, formattedCheckOutTime, formattedDuration]);
    });
  
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const fileName = `work_record_${this.selectedMonth.replace(/ /g, '_')}.csv`;
  
    saveAs(blob, fileName);
  }
  
 
}
