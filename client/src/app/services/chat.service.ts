import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  public message$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private apiUrl = 'http://localhost:3000/api/messages';

  private socket = io('http://localhost:3000');

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

  listenForNewMessages(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('new_message', (message: Message) => {
        subscriber.next(message);
      });
    });
  }

  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getMessagesByChannel(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/byChannel/${channelId}`);
  }

}
