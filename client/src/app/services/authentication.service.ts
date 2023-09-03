import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, loginCredentials } from './../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:3000/api'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) { }

  /**
   * Login a user
   * @param credentials 
   * @returns 
   */
  login(credentials: loginCredentials): Observable<any> {
    interface LoginResponse {
      valid: boolean;
      user: User;
    }
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.valid) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          console.log('User logged in successfully');
        }
      })
    );
  }



  /**
   * Register a user
   * @param user
   * @returns
   */
  register(user: User): Observable<any> {
    console.log(user);
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }
}
