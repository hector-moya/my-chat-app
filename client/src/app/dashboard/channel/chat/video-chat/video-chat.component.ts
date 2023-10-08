import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Peer, MediaConnection } from 'peerjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-video-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-chat.component.html',
  styles: [
  ]
})
export class VideoChatComponent implements OnInit {  
  @Input() currentChannelId: string | undefined;
  peer: Peer | null = null;
  myStream: MediaStream | null = null;
  peers: { [id: string]: MediaConnection } = {};

  private chatService = inject(ChatService);


  ngOnInit(): void {
    // Initialize PeerJS
    this.peer = new Peer('default-id', {
      host: 'peerjs.com',  // Public PeerJS server
      port: 443,  // Port for the public PeerJS server
      path: '/myapp',  // Path on the server, if needed
      secure: false,  // Use secure connection (HTTPS/WSS)
    });

    // Get the user's video and audio
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.myStream = stream;
      });

    // Listen for incoming calls
    this.peer.on('call', call => {
      if (this.myStream) {
        call.answer(this.myStream);  // Answer the call with the user's stream
        call.on('stream', remoteStream => {
          // TODO: Display the remote stream
        });
      }
    });

    this.chatService.onNewPeer().subscribe(peerId => {
      this.connectToPeer(peerId);
    });
    
    this.peer.on('error', err => {
      console.error('Error while connecting to PeerJS server:', err);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateVideoConnections();
  }

  
  connectToPeer(peerId: string): void {
    if (peerId !== this.peer?.id) {  // Don't connect to self
      const call = this.peer?.call(peerId, this.myStream!);
      if (call) {
        this.peers[peerId] = call;
        call.on('stream', remoteStream => {
          // TODO: Display the remote stream
        });
      }
    }
  }

  startVideoCall(): void {
    if (!this.currentChannelId) return;  // Ensure there's a current channel

    // Get user media (camera and microphone access)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.myStream = stream;  // Store the user's media stream
        this.updateVideoConnections();  // Now update video connections
      })
      .catch(err => {
        console.error('Error accessing media devices.', err);
      });
  }

  updateVideoConnections(): void {
    if (!this.currentChannelId) return;

    // Get a list of peers in the current channel from your server
    // Assume getPeersInChannel is a method in your chatService that returns an array of peer IDs
    this.chatService.getPeersInChannel(this.currentChannelId).subscribe((peerIds: string[]) => {
      // Connect to all peers in the channel
      for (let peerId of peerIds) {
        if (peerId !== this.peer?.id) {  // Don't connect to self
          const call = this.peer?.call(peerId, this.myStream!);
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



}
