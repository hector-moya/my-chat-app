import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from 'src/app/services/chat.service';
import { ModalComponent } from 'src/app/modal/modal.component';

@Component({
  selector: 'app-video-chat',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './video-chat.component.html',
  styles: [
  ]
})
export class VideoChatComponent implements OnInit {  
  @Input() currentChannelId: string | undefined;
  myStream: MediaStream | null = null;
  showVideoChat: boolean = false;

  private chatService = inject(ChatService);


  ngOnInit(): void {
  }

  showModal(): void {
    this.showVideoChat = true;
  }

  startVideoCall(): void {
    this.showVideoChat = true;
    console.log('Current Channel Id: ', this.currentChannelId);

    this.chatService.peerConnection(this.currentChannelId || '');

    // Obtain user media
    this.chatService.getUserMedia().then(stream => {
      this.myStream = stream;
      this.chatService.joinVideoRoom(this.currentChannelId || '', stream);
    }).catch(err => {
      console.error('Error accessing media devices.', err);
    });
  }

  endVideoCall(): void {
    this.chatService.leaveVideoRoom(this.currentChannelId || '');
  }
}
