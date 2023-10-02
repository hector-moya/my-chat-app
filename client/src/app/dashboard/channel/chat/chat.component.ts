import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';

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
  private previousChannelId?: string;

  private chatService = inject(ChatService);
  private channelService = inject(ChannelService);
  private userService = inject(UserService);
  private currentSocketSubscription?: Subscription;

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
    });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['currentChannelId'] && changes['currentChannelId'].currentValue) {
  //     if (this.previousChannelId) {
  //       this.chatService.leaveRoom(this.previousChannelId);
  //       if (this.currentSocketSubscription) {
  //         this.currentSocketSubscription.unsubscribe();
  //       }
  //     }
  //     this.previousChannelId = this.currentChannelId; // Store the current channelId as previous for the next cycle
  
  //     this.chatService.joinRoom(this.currentChannelId!);
  
  //     // ... rest of your code ...
  
  //     this.currentSocketSubscription = this.chatService.listenForNewMessages().subscribe(newMsg => {
  //       this.messages.push(newMsg);
  //     });
  //   }
  // }

  postMessage(event: Event) {
    event.preventDefault();
    if (this.newMessage.trim()) {
      const message: Message = {
        userId: this.user._id,  // This should be replaced with the logged-in user's ID
        channelId: this.currentChannelId!,
        message: this.newMessage,
        createdAt: new Date()
      };

      this.chatService.sendMessage(this.currentChannelId!, this.newMessage);

      this.chatService.postMessage(message).subscribe(res => {
        // The response will be the saved message with its ID, so you can push it to the messages array
        this.messages.push(res);
        this.newMessage = '';  // Clear the input
      });
    }
  }

  getUserName(message: Message): string {
    if (typeof message.userId === 'string') {
      return '';
    }
    return message.userId.userName;
  }

  getUserEmail(message: Message): string {
    if (typeof message.userId === 'string') {
      
      //find user by id
      this.userService.getUserById(message.userId).subscribe(user => {
        return user.email;
      });
      return '';
    }
    return message.userId.email;
  }

}
