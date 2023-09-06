import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  

  constructor(private channelService: ChannelService) { }
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

}
