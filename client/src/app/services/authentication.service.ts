import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { User, loginCredentials } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isLoggedIn = false;
  redirectUrl: string | null = null;

  private apiUrl = 'http://localhost:3000/api'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) {
    this.checkIsLoggedIn();
  }

  /**
   * Login a user
   * @param credentials
   * @returns
   */
  login(credentials: loginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.valid) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          console.log('User logged in successfully');
          this.isLoggedIn = true;
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    console.log('User logged out successfully');
    this.isLoggedIn = false;
  }

  /**
   * Register a user
   * @param user
   * @returns
   */
  register(user: User): Observable<boolean> {
    interface RegisterResponse {
      valid: boolean;
      user: User;
    }
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap((response: RegisterResponse) => {
          if (response.valid) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            console.log('User registered successfully', response.user);
          }
        }),
        map((response: RegisterResponse) => response.valid) // map the response to a boolean value
      );
  }

  checkIsLoggedIn(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.isLoggedIn = true;
    }
  }
}
