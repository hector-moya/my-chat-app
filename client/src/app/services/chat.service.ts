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


  //------------------------------------------------------------------------//
  //-----------------------------Peer methods-------------------------------//
  //------------------------------------------------------------------------//

  /**
   * Connect to the PeerJS server
   * @param channelId 
   */
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

  /**
   * Get the user's video media
   * @returns 
   */
  public getUserMedia(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  /**
   * Call a peer
   * @param peerId 
   * @param stream 
   * @returns 
   */
  public callPeer(peerId: string, stream: MediaStream): MediaConnection | null {
    if (this.peer) {
      return this.peer.call(peerId, stream);
    }
    console.error('Peer object is null. Cannot call peer.');
    return null;
  }

  /**
   * Get the user's video media and join the video room
   * @param channelId 
   * @param stream 
   */
  public joinVideoRoom(channelId: string, stream: MediaStream): void {
    // Emit the join_video_room event to the server
    this.socket.emit('join_video_room', channelId);
    // Assume getPeersInChannel is a method that returns an array of peer IDs
    this.getPeersInChannel(channelId).subscribe(peerIds => {
      for (let peerId of peerIds) {
        if (peerId !== this.peer?.id) {  // Don't connect to self
          const call = this.callPeer(peerId, stream);
          if (call) {
            this.peers[peerId] = call;
            call.on('stream', remoteStream => {
              const videoElement = document.createElement('video');
              videoElement.srcObject = remoteStream;
              videoElement.autoplay = true;
              document.getElementById('remoteVideos')?.appendChild(videoElement);
            });
          }
        }
      }
    });
  }

  /**
   * Get the list of peers in a channel
   * @param channelId 
   * @returns 
   */
  getPeersInChannel(channelId: string): Observable<any> {
    return new Observable(observer => {
      this.socket.emit('get_peers', channelId);  // Request the list of peers
      this.socket.on('peers_in_channel', (data: any) => {
        observer.next(data);
      });
    });
  }

  /**
   * Observe the new_peer event from the socket server
   * @returns 
   */
  onNewPeer(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('new_peer', (peerId: string) => {
        observer.next(peerId);
      });
    });
  }

  /**
   * Get the user's screen media
   * @returns 
   */
  public getScreenMedia(): Promise<MediaStream> {
    return navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
  }

  /**
   * Leave the video room
   * @param channelId 
   */
  public leaveVideoRoom(channelId: string): void {
    // Notify the server that you're leaving the room (if supported by your backend)
    this.socket.emit('leave_video_room', channelId);

    // Close connections to all peers in the current room
    for (let peerId in this.peers) {
      this.peers[peerId].close();
    }
    this.peers = {};  // Clear the peers object
    // Remove video elements for remote streams
    const remoteVideos = document.getElementById('remoteVideos');
    while (remoteVideos && remoteVideos.firstChild) {
      remoteVideos.removeChild(remoteVideos.firstChild);
    }
  }

  /**
   * Close the peer connection
   */
  public closePeerConnection(): void {
    if (this.peer) {
      this.peer.destroy();
    }
  }

  /**
   * Replace the user's video stream with a screen stream
   * @param channelId 
   * @param newStream 
   */
  public replaceStream(channelId: string, newStream: MediaStream): void {
    // Close existing calls
    for (let peerId in this.peers) {
      this.peers[peerId].close();
    }

    // Clear the peers object
    this.peers = {};

    // Re-join the video room with the new stream
    this.joinVideoRoom(channelId, newStream);
  }


  //------------------------------------------------------------------------//
  //-----------------------------Socket methods-----------------------------//
  //------------------------------------------------------------------------//

  /**
   * Send a join_room event to the socket server
   * @param channelId 
   * @param user 
   */
  public joinRoom(channelId: string, user: any) {
    this.socket.emit('join_room', channelId, user._id, user.userName);
  }

  /**
   * Send a leave_room event to the socket server
   * @param channelId 
   * @param user 
   */
  public leaveRoom(channelId: string, user: any) {
    console.log('leaving room');
    this.socket.emit('leave_room', channelId, user._id, user.userName);
  }

  /**
   * Send a message event to the socket server
   * @param channelId 
   * @param message 
   * @param user 
   * @param type 
   */
  public sendMessage(channelId: string, message: string, user: any, type: string) {
    this.socket.emit('message', { channelId, message, user, type });
  }

  /**
   * Observe the new_message event from the socket server
   * @returns 
   */
  public onNewImageMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new_image_message', (data: any) => {
        observer.next(data);
      });
    });
  }

  /**
   * Listen for new messages from the socket server
   * @returns 
   */
  listenForNewMessages(): Observable<Message> {
    this.socket.on('new_message', (data: any) => {
      this.newMessageSubject.next(data);
    });

    return this.newMessageSubject.asObservable();
  }
  /**
   * Observe the user_joined event from the socket server
   * @returns 
   */
  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_joined', (userData: any) => {
        observer.next(userData);
      });
    });
  }

  /**
   * Observe the user_left event from the socket server
   * @returns 
   */
  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user_left', (userData: any) => {
        console.log('User left: ', userData);
        observer.next(userData);
      });
    });
  }

  // -----------------------------------------------------------------------//
  //-----------------------------API methods--------------------------------//
  //------------------------------------------------------------------------//

  /**
   * Post a message to the API
   * @param message 
   * @returns 
   */
  postMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  /**
   * Get messages by channel ID
   * @param channelId 
   * @returns 
   */
  getMessagesByChannel(channelId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/byChannel/${channelId}`);
  }

  /**
   * Upload an image to the API
   * @param channelId 
   * @param user 
   * @param file 
   * @returns 
   */
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
}