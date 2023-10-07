import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/interfaces/message.model';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/interfaces/user.model';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule, CommonModule]

})
export class ChatComponent implements OnInit {
  @Input() currentChannelId: string | undefined;
  user: any = {};
  messages: Message[] = [];
  newMessage: string = '';
  channelName: string | null = null;

  private chatService = inject(ChatService);
  private changeDetector = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // Load existing messages
    if (this.currentChannelId) {
      this.chatService.joinRoom(this.currentChannelId);
      this.chatService.getMessagesByChannel(this.currentChannelId).subscribe(messages => {
        this.messages = messages;
      });
    }
    // Listen for new messages
    this.chatService.listenForNewMessages().subscribe(newMsg => {
        this.messages.push(newMsg);
        this.changeDetector.detectChanges();
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentChannelId']) {
      this.changeDetector.detectChanges();
      this.chatService.joinRoom(this.currentChannelId!);
      this.chatService.getMessagesByChannel(this.currentChannelId!).subscribe(messages => {
        this.messages = messages;
      });
    }
  }

  postMessage(event: Event) {
    event.preventDefault();
    if (this.newMessage.trim()) {
      const message: Message = {
        userId: this.user._id,  // This should be replaced with the logged-in user's ID
        channelId: this.currentChannelId!,
        message: this.newMessage,
        createdAt: new Date()
      };


      this.chatService.postMessage(message).subscribe(() => {
        this.chatService.sendMessage(this.currentChannelId!, this.newMessage, this.user);
        this.newMessage = '';  // Clear the input
      });
    }
  }

  getUserName(message: Message): string {
    const user = 'user' in message ? message.user : message.userId;
    if ((user as User).userName) {
      let userName = (user as User).userName;
      return userName;
    }
    return 'User Name';
    ;
  }

  getUserEmail(message: Message): string {
    const user = 'user' in message ? message.user : message.userId;
    if ((user as User).email) {
      let userEmail = (user as User).email;
      return userEmail;
    }
    return 'User Email';
  }

}
