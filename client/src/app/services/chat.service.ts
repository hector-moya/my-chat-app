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

  public joinRoom(channelId: string) {
    this.socket.emit('join_room', channelId);
  }

  public sendMessage(channelId: string, message: string, user: any) {
    this.socket.emit('message', { channelId, message, user });
  }

  public leaveRoom(channelId: string) {
    this.socket.emit('leave_room', channelId);
  }

  listenForNewMessages(): Observable<Message> {
    this.socket.on('new_message', (data: any) => {
      console.log('User Id: ', data.userId, 'Message Id: ', data._id,'User Obj: ', data.user,'Message: ',data.message, 'channelId: ',data.channelId, 'created: ',data.createdAt);
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

}
