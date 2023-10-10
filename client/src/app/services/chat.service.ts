import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { Message } from '../interfaces/message.model';
import { HttpClient } from '@angular/common/http';
import { Peer, MediaConnection } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/message';
  private socket = io('http://localhost:3000');
  private newMessageSubject: Subject<Message> = new Subject<Message>();
  private peer: Peer | null = null;
  private peers: { [id: string]: MediaConnection } = {};

  constructor(private http: HttpClient) { }

  public peerConnection(channelId: string) {
    this.peer = new Peer(channelId, {
      host: 'localhost',  // Pointing to localhost
      port: 3000,  // The port your server is running on
      path: '/peerjs/myapp',  // The path to your Peer server
      secure: false,  // Set to false since you're likely not using HTTPS in localhost
    });

    this.peer?.on('open', id => {
      console.log('Peer connection established. Your peer ID is:', id);
    });
    
    this.peer?.on('error', err => {
      console.error('Error while connecting to PeerJS server:', err);
    });

    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.peer = null;
    });
  }

  public getUserMedia(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  public callPeer(peerId: string, stream: MediaStream): MediaConnection | null {
    if (this.peer) {
      return this.peer.call(peerId, stream);
    }
    console.error('Peer object is null. Cannot call peer.');
    return null;
  }

  public joinVideoRoom(channelId: string, stream: MediaStream): void {
    // Assume getPeersInChannel is a method that returns an array of peer IDs
    this.getPeersInChannel(channelId).subscribe(peerIds => {
      for (let peerId of peerIds) {
        if (peerId !== this.peer?.id) {  // Don't connect to self
          const call = this.callPeer(peerId, stream);
          if (call) {
            this.peers[peerId] = call;
            call.on('stream', remoteStream => {
              // TODO: Display the remote stream
            });
          }
        }
      }
    });
  }

  public leaveVideoRoom(channelId: string): void {
    for (let peerId in this.peers) {
      this.peers[peerId].close();
    }
    this.peers = {};
  }

  public closePeerConnection(): void {
    if (this.peer) {
      this.peer.destroy();
    }
  }

  public joinRoom(channelId: string, user: any) {
    this.socket.emit('join_room', channelId, user._id, user.userName);
  }

  public leaveRoom(channelId: string, user: any) {
    console.log('leaving room');
    this.socket.emit('leave_room', channelId, user._id, user.userName);
  }

  public sendMessage(channelId: string, message: string, user: any, type: string) {
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