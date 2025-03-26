// import { HttpClient } from '@angular/common/http';

// import { environment } from '../../environments/environment.prod';
// import { inject, Injectable } from '@angular/core';


// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   getUserId() {
//     throw new Error('Method not implemented.');
//   }

//   constructor() {}
// http = inject(HttpClient);

//   register(name: string, email: string, password: string, p0: string){
//     return this.http.post(environment.apiUrl+"/auth/register",{
//       name,
//       email,
//       password,
//     });
//   }

//   login(email:string,password:string){
//     return this.http.post(environment.apiUrl+"/auth/login",{
//       email,
//       password,
//     });
//   }

//   get isLoggedIn(): boolean {
//     return typeof window !!== "undefined" && localStorage.getItem("token") !== null;
//   }
  
//   get isAdmin(): boolean {
//     if (typeof window !== "undefined") {
//       let userData = localStorage.getItem("user");
//       if (userData) {
//         return JSON.parse(userData).isAdmin;
//       }
//     }
//     return false;
//   }
  
//   get userName(): string | null {
//     if (typeof window !== "undefined") {
//       let userData = localStorage.getItem("user");
//       if (userData) {
//         return JSON.parse(userData).name;
//       }
//     }
//     return null;
//   }
  
//   get userEmail(): string | null {
//     if (typeof window !== "undefined") {
//       let userData = localStorage.getItem("user");
//       if (userData) {
//         return JSON.parse(userData).email;
//       }
//     }
//     return null;
//   }
//   //i am giving manali type it
//   getCurrentUser(): { _id: string; name: string; email: string } | null {
//     if (typeof window !== "undefined") {
//       const userData = localStorage.getItem("user");
//       if (userData) {
//         return JSON.parse(userData);
//       }
//     }
//     return null;
//   }

//   logout() {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     }
//   }

//   get userId(): string | null {
//     if (typeof window !== "undefined") {
//       let userData = localStorage.getItem("user");
//       if (userData) {
//         return JSON.parse(userData)._id; // Make sure the user object contains `_id`
//       }
//     }
//     return null;
//   }
  
// }



import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  http = inject(HttpClient);

  register(name: string, email: string, mobile: string, password: string) {
    return this.http.post(environment.apiUrl + '/auth/register', {
      name,
      email,
      mobile,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http.post(environment.apiUrl + '/auth/login', {
      email,
      password,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(environment.apiUrl + '/auth/forgot-password', {
      email,
    });
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post(environment.apiUrl + '/auth/verify-otp', {
      email,
      otp,
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    console.log('Payload being sent:', { token, newPassword });
  
    return this.http.post(
      environment.apiUrl + '/auth/reset-password',
      { token, newPassword },
      { headers: { 'Content-Type': 'application/json' } } // ✅ Ensure JSON format
    );
  }
  

  get isLoggedIn(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('authToken') !== null;
  }

  get isAdmin (): boolean {
    if (typeof window !== 'undefined') {
      let authToken = localStorage.getItem('authToken');
      if (authToken) {
        // Decode the authToken
        let decodedToken = JSON.parse(atob(authToken.split('.')[1]));
  
        // Check if isAdmin exists in decoded token and return its value
        if (decodedToken && decodedToken.isAdmin !== undefined) {
          return decodedToken.isAdmin;
        }
      }
    }
    return false; // Default to false if no isAdmin found or localStorage is unavailable
  }
  

  get userName(): string | null {
    if (typeof window !== 'undefined') {
      let userData = localStorage.getItem('loginUser');
      if (userData) {
        return JSON.parse(userData).name;
      }
    }
    return null;
  }

  get userEmail(): string | null {
    if (typeof window !== 'undefined') {
      let userData = localStorage.getItem('loginUser');
      if (userData) {
        return JSON.parse(userData).email;
      }
    }
    return null;
  }

  getCurrentUser(): { _id: string; name: string; email: string; mobile: string } | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('loginUser');
      if (userData) {
        return JSON.parse(userData);
      }
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('loginUser');
    }
  }

  get userId(): string | null {
    if (typeof window !== 'undefined') {
      let userData = localStorage.getItem('loginUser');
      if (userData) {
        return JSON.parse(userData)._id;
      }
    }
    return null;
  }

  getUserId(): string | null {
    return this.userId;
  }
}