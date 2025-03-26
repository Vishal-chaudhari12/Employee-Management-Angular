export class TimeTrackingModel {
    employeeId: string;
    checkInTime: Date | null;
    checkOutTime: Date | null;
    totalTime: number;
  
    constructor() {
      this.employeeId = '';
      this.checkInTime = null;
      this.checkOutTime = null;
      this.totalTime = 0;
    }
  }
  