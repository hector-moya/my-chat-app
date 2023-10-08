import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/interfaces/message.model';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/app/interfaces/user.model';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ModalComponent } from 'src/app/modal/modal.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [FormsModule, CommonModule, PickerComponent, ModalComponent, VideoChatComponent]

})

export class ChatComponent implements OnInit {
  @Input() currentChannelId: string | undefined;
  user: any = {};
  messages: Message[] = [];
  newMessage: string = '';
  channelName: string | null = null;
  emojimessage = '';
  showEmojiPicker = false;
  showImageModal: boolean = false;

  private chatService = inject(ChatService);
  private changeDetector = inject(ChangeDetectorRef);

  /**
   * On init, get the current user from local storage
   * If there is a current channel id, join the channel and get the messages
   * Listen for new messages
   * @returns
   * @memberof ChatComponent
   */
  ngOnInit(): void {
    this.initializeUser();
    this.initializeChannel();
    this.listenForEvents();  
  }

  /**
   * Detects changes to the current channel id
   * Leaves the current channel and joins the new channel
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentChannelId']) {
      this.initializeUser();
      this.updateChannel();
    }
  }

  private initializeUser(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  private initializeChannel(): void {
    if (this.currentChannelId) {
      this.leaveChannel();
      this.joinChannel();
      this.loadMessages();
    }
  }

  private updateChannel(): void {
    this.leaveChannel();
    this.joinChannel();
    this.loadMessages();
  }

  private joinChannel(): void {
    this.chatService.joinRoom(this.currentChannelId!, this.user);
  }

  private leaveChannel(): void {
    this.chatService.leaveRoom(this.currentChannelId!, this.user);
  }

  private loadMessages(): void {
    this.chatService.getMessagesByChannel(this.currentChannelId!).subscribe(messages => {
      this.messages = messages;
      this.changeDetector.detectChanges();
    });
  }

  private listenForEvents(): void {
    this.chatService.listenForNewMessages().subscribe(newMsg => {
      this.messages.push(newMsg);
    });

    this.chatService.onNewImageMessage().subscribe((data: any) => {
      this.messages.push(data);
      this.changeDetector.detectChanges();
    });

    this.chatService.onUserLeft().subscribe(userData => {
      console.log('on user left: ',userData);
      this.createMessage(`${userData.userName} left the channel.`, 'system');
    });

    this.chatService.onUserJoined().subscribe(userData => {
      console.log('on user join: ' , userData);
      this.createMessage(`${userData.userName} joined the channel.`, 'system');
    });

  }

  /**
   * Posts a message to the current channel and saves it to the database
   * Emits a new message event
   * Clears the input
   * @param event 
   */
  postMessage(event: Event) {
    event.preventDefault();
    if (this.newMessage.trim()) {
      this.createMessage(this.newMessage);
    }
  }
  
  createMessage(messageText: string, type: string = 'user') {
    const message: Message = {
      userId: this.user._id,
      channelId: this.currentChannelId!,
      message: messageText,
      type: type,
      createdAt: new Date()
    };
    this.chatService.postMessage(message).subscribe(() => {
      this.chatService.sendMessage(this.currentChannelId!, messageText, this.user, type);
      this.newMessage = '';  // Clear the input
    });
  }
  

  /**
   * Gets the user's name from the message
   * @param message 
   * @returns 
   */
  getUserName(message: Message): string {
    const user = 'user' in message ? message.user : message.userId;
    if ((user as User).userName) {
      let userName = (user as User).userName;
      return userName;
    }
    return 'No User Name';
    ;
  }

  /**
   * Gets the user's email from the message
   * @param message 
   * @returns 
   */
  getUserEmail(message: Message): string {
    const user = 'user' in message ? message.user : message.userId;
    if ((user as User).email) {
      let userEmail = (user as User).email;
      return userEmail;
    }
    return 'No User Email';
  }

  /**
   * Gets image url from the message
   * @param message
   * @returns
   */
  getImageUrl(message: Message): string {
    const user = 'user' in message ? message.user : message.userId;
    if ((user as User).imageUrl) {
      let imageUrl = (user as User).imageUrl;
      return imageUrl as string;
    }
    return 'No Image Url';
  }
  /**
   * Emoji Picker
   * Hides the emoji picker when the user clicks outside of the picker
   */
  onFocus() {
    console.log('focus');
    this.showEmojiPicker = false;
  }

  /**
   * Emoji Picker
   * Toggles the emoji picker
   */
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  /**
   * Emoji Picker
   * Adds the selected emoji to the message
   * @param event 
   */
  addEmoji(event: any) {
    const text = `${this.newMessage}${event.emoji.native}`;
    this.newMessage = text;
  }

  uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];

      if (this.currentChannelId && this.user._id) {
        this.chatService.uploadImage(this.currentChannelId, this.user, file).subscribe((response: any) => {
          console.log(response.message);
          if (response.message) {
            this.showImageModal = false;
          }
        });
      }
    } else {
      console.error('No file selected or event target is null');
    }
  }



}
