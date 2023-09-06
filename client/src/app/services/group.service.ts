import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Group, UserGroup } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/group'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) {}

  // Function to get all groups (not user-specific)
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}`);
  }

  // Function to get groups by user ID
  getGroupsByUserId(userId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/byUser/${userId}`);
  }

  // Function to add a new group
  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}`, group);
  }

  // Function to update an existing group
  updateGroup(group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${group.id}`, group);
  }

  // Function to delete a group by ID
  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${groupId}`);
  }

  // Function to get the user's role for a group
  getUserRole(groupId: number, userId: number): Observable<boolean> {
    return this.http.get<{ roleID: number }>(`${this.apiUrl}/userRole/${groupId}/${userId}`).pipe(
      tap((response) => { 
        console.log('Response: ', response)
      }),
      map((response) => {
        return response.roleID === 2;
      })
    );
  }
}
