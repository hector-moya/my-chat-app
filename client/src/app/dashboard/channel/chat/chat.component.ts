import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Channel } from 'src/app/models/channel.model';
import { Message } from 'src/app/models/message.model';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule, CommonModule]

})
export class ChatComponent implements OnInit {
  @Input() currentChannelId: string | undefined;
  messages: Message[] = [];
  newMessage: string = '';
  channelName: string | null = null;

  private chatService = inject(ChatService);
  private channelService = inject(ChannelService);

  ngOnInit(): void {
    // Load existing messages
    if (this.currentChannelId) {
      this.chatService.getMessagesByChannel(this.currentChannelId).subscribe(messages => {
        this.messages = messages;
      });
    }

    // Listen for new messages
    this.chatService.listenForNewMessages().subscribe(newMsg => {
      this.messages.push(newMsg);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentChannelId'] && changes['currentChannelId'].currentValue) {
      this.channelService.getChannelById(this.currentChannelId!).subscribe({
        next: (channel) => {
          this.channelName = channel.channelName;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  postMessage() {
    if (this.newMessage.trim()) {
      const message: Message = {
        _id: '',  // This can be removed as the backend will generate it
        userId: '123',  // This should be replaced with the logged-in user's ID
        channelId: this.currentChannelId!,
        message: this.newMessage,
        createdAt: new Date()
      };

      this.chatService.postMessage(message).subscribe(res => {
        // The response will be the saved message with its ID, so you can push it to the messages array
        this.messages.push(res);
        this.newMessage = '';  // Clear the input
      });
    }
  }

}
