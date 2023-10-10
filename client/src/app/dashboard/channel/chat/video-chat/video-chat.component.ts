import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
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
  private changeDetector = inject(ChangeDetectorRef);


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
    this.chatService.closePeerConnection();
    this.showVideoChat = false;    
  }

  startScreenShare(): void {
    this.chatService.getScreenMedia().then(screenStream => {
      // Assume replaceStream is a method on ChatService that replaces the user's video stream
      this.chatService.replaceStream(this.currentChannelId || '', screenStream);
      this.changeDetector.detectChanges();
    }).catch(err => {
      console.error('Error accessing screen.', err);
    });
  }

  toggleCamera(): void {
    if (this.myStream) {
      const videoTracks = this.myStream.getVideoTracks();
      for (const track of videoTracks) {
        track.enabled = !track.enabled;
      }
    }
  }

  toggleMicrophone(): void {
    if (this.myStream) {
      const audioTracks = this.myStream.getAudioTracks();
      for (const track of audioTracks) {
        track.enabled = !track.enabled;
      }
    }
  }
}
