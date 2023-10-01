import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/user'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) { }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Update user's role
  updateUserRole(id: string, isSuper: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateRole/${id}`, { isSuper });
  }

  // Get users by group ID
  getUsersByGroupId(groupId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/byGroup/${groupId}`);
  }

}
