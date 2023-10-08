import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role, UpdateResponse, User } from '../interfaces/user.model';

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
  
  // Update user's profile
  updateUser(id: string, user: FormData): Observable<UpdateResponse> {
    const url = `${this.apiUrl}/updateProfile/${id}?contentType=users&id=${id}`;
    return this.http.put<UpdateResponse>(url, user);
}

  // Get users by group ID
  getUsersByGroupId(groupId: string | undefined): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/byGroup/${groupId}`);
  }

  // Check user by email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/byEmail/${email}`);
  }

  // Add user to a group
  addUserToGroup(email: string, groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addToGroup`, { email, groupId });
  }

  // Remove user from a group
  removeUserFromGroup(userId: string, groupId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/removeFromGroup/${userId}/${groupId}`);
  }

  // Get user's role in a group
  getUserRole(groupId: string | undefined, userId: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/getRoleInGroup/${groupId}/${userId}`);
  }

  // Update user's role in a group
  updateUserRoleInGroup(userId: string, groupId: string | undefined, roleName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateRoleInGroup`, { userId, groupId, roleName });
  }

  // Get users by channel ID
  getUsersByChannelId(channelId: string | undefined): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/byChannel/${channelId}`);
  }

  // Add user to a channel
  addUserToChannel(userId: string, channelId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addToChannel`, { userId, channelId });
  }

  // Remove user from a channel
  removeUserFromChannel(userId: string, channelId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/removeFromChannel/${userId}/${channelId}`);
  }

}
