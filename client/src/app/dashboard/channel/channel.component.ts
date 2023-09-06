import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Channel } from 'src/app/models/channel.model';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  standalone: true,
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styles: [
  ],
  imports: [NgFor, CommonModule, FormsModule]
})
export class ChannelComponent implements OnInit {
  @Input() groupId!: number;
  user: any;
  channels: Channel[] = [];
  editingChannelId: number | null = null;
  

  constructor(private channelService: ChannelService, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loadChannels();
  }

  loadChannels(): void {
    this.channelService.getUserChannel(this.groupId, this.user.id).subscribe({
      next: (channels) => {
        this.channels = channels;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Function to edit a channel
   * @param channelId
   */
  editingChannel(channelId: number): void {
    // Set the editingChannelId to the ID of the channel being edited
    this.editingChannelId = channelId;
  }

  /**
   * Function to save a channel
   * @param channel
   */
  saveChannel(channel: Channel): void {
    // Update the channel name and set the editing flag to false
    this.channelService.updateChannel(channel).subscribe((updatedChannel) => {
      channel.channelName = updatedChannel.channelName;
      this.editingChannelId = null;
    });
  }

  /**
   * Function to delete a channel
   * @param id
   */
  deleteChannel(id: number): void {
    // Delete the channel using the ChannelService
    this.channelService.deleteChannel(id).subscribe({
      next: () => {
        // Remove the channel from the array
        this.channels = this.channels.filter((g) => g.id !== id);
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting channel:', error);
      },
    });
  }


  openChat(id: number): void {
    console.log(`Here we will put the code to open the chat for channel: ${id}`);
  }

}
