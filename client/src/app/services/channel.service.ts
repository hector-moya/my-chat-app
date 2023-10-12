import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../interfaces/channel.model';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  public apiUrl = 'http://localhost:3000/api/channel'; // In the future, this will be in an environment variable

  constructor(private http: HttpClient) {}

  // Function to get all channels (not user-specific)
  getAllChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}`);
  }

  // Function to get channels by group ID
  getChannelsByGroupId(groupId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/byGroup/${groupId}`);
  }

  getChannelById(channelId: string): Observable<Channel> {
    return this.http.get<Channel>(`${this.apiUrl}/${channelId}`);
  }

  // Function to add a new channel
  addChannel(channel: Channel, groupId: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/${groupId}`, channel);
  }

  // Function to update an existing channel
  updateChannel(channel: Channel): Observable<Channel> {
    return this.http.put<Channel>(`${this.apiUrl}/${channel._id}`, channel);
  }

  // Function to delete a channel by ID
  deleteChannel(channelId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${channelId}`);
  }

  // Function to get channels by group ID and user ID
  getUserChannel(groupId: string, userId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/byUser/${groupId}/${userId}`);
  }
}
