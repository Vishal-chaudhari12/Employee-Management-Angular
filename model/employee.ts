export class EmployeeModel {
  name: string;
  email: string;
  mobNo: number;
  deptName: string;
  dob: string;
  address: string;
  graduation: string;
  designation: string;
  salary: string;
  joiningDate: string;
  marksheet: File | null;
  resume: File | null;

  constructor() {
    this.name = '';
    this.email = '';
    this.mobNo = 0;
    this.deptName = '';
    this.address = '';
    this.graduation = '';
    this.joiningDate = '';
    this.salary = '';
    this.dob = '';
    this.designation = '';
    this.marksheet = null;
    this.resume = null;
  }
}
