import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  private apiUrl = 'http://localhost:3000/api/channel'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) {}

  // Function to get all channels (not user-specific)
  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}`);
  }

  // Function to get channels by group ID
  getChannelsByGroupId(groupId: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/byGroup/${groupId}`);
  }

  getChannelsById(channelId: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/${channelId}`);
  }

  // Function to add a new channel
  addChannel(channel: Channel): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}`, channel);
  }

  // Function to update an existing channel
  updateChannel(channel: Channel): Observable<Channel> {
    return this.http.put<Channel>(`${this.apiUrl}/${channel.id}`, channel);
  }

  // Function to delete a channel by ID
  deleteChannel(channelId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${channelId}`);
  }

  // Function to get channels by group ID and user ID
  getUserChannel(groupId: number, userId: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/byUser/${groupId}/${userId}`);
  }
}
