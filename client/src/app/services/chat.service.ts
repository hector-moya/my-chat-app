import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  public message$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/message';

  private socket = io('http://localhost:3000');

  private newMessageSubject = new Subject<Message>();

  constructor(private http: HttpClient) { }

  public joinRoom(channelId: string) {
    this.socket.emit('join_room', channelId);
  }

  public sendMessage(channelId: string, message: string) {
    this.socket.emit('message', { channelId, message });
  }

  public getNewMessage = () => {
    this.socket.on('new_message', (message) => {
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };

  public leaveRoom(channelId: string) {
    this.socket.emit('leave_room', channelId);
  }

  listenForNewMessages(): Observable<Message> {
    this.socket.on('new_message', (message: Message) => {
      this.newMessageSubject.next(message);
    });

    return this.newMessageSubject.asObservable();
   
  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getMessagesByChannel(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/byChannel/${channelId}`);
  }

}
