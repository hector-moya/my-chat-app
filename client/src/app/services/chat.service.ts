import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../interfaces/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  private apiUrl = 'http://localhost:3000/api/message';

  private socket = io('http://localhost:3000');

  private newMessageSubject: Subject<Message> = new Subject<Message>();

  constructor(private http: HttpClient) { }

  public joinRoom(channelId: string, user: any) {
    this.socket.emit('join_room', channelId, user._id, user.userName);
  }

  public leaveRoom(channelId: string, user: any) {
    console.log('leaving room');
    this.socket.emit('leave_room', channelId, user._id, user.userName);
    console.log('left room');
  }

  public sendMessage(channelId: string, message: string, user: any, type:string) {
    this.socket.emit('message', { channelId, message, user, type });
  }

  public onNewImageMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new_image_message', (data: any) => {
        observer.next(data);
      });
    });
  }

  listenForNewMessages(): Observable<Message> {
    this.socket.on('new_message', (data: any) => {
      this.newMessageSubject.next(data);
    });

    return this.newMessageSubject.asObservable();

  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getMessagesByChannel(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/byChannel/${channelId}`);
  }

  uploadImage(channelId: string, user: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.apiUrl}/upload?contentType=messages&id=${channelId}&userId=${user._id}`;
    return new Observable(observer => {
      this.http.post(url, formData).subscribe({
        next: (response: any) => {
          console.log(response.message);
          if (response.message) {
            // If the image upload is successful, emit a new_image_message event to the socket server
            this.socket.emit('new_image_message', { channelId, message: response.message, user, imageUrl: response.imageUrl });
            observer.next(response);
          } else {
            observer.error('Failed to upload image');
          }
        },
        error: (error: any) => {
          observer.error(error);
        }
      })
    });
  }

  getPeersInChannel(channelId: string): Observable<any> {
    return new Observable(observer => {
      this.socket.emit('get_peers', channelId);  // Request the list of peers
      this.socket.on('peers_in_channel', (data: any) => {
        observer.next(data);
      });
    });
  }

  onNewPeer(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('new_peer', (peerId: string) => {
        observer.next(peerId);
      });
    });
  }
  
  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_joined', (userData: any) => {
        console.log('User joined', userData);
        observer.next(userData);
      });
    });
  }
  
  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_left', (userData: any) => {
        console.log('User left: ', userData);
        observer.next(userData);
      });
    });
  }
}