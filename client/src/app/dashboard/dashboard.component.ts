import { Component, OnInit, inject } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RegisterComponent } from '../authentication/register/register.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ChatComponent } from './channel/chat/chat.component';
import { ChannelService } from '../services/channel.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  imports: [GroupComponent, CommonModule, NgIf, RegisterComponent, UserManagementComponent, ChatComponent],
})
export class DashboardComponent implements OnInit {
  currentUser: any = null; // Store the current user information
  groups: any[] = []; // This should come from your group service.
  showAddUserModal: boolean = false;
  currentChannelId: string | undefined;

  public authenticationService = inject(AuthenticationService);
  private channelService = inject(ChannelService);


  ngOnInit(): void {
    // Fetch the current user from session storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  onChannelSelected(channelId: string): void {
    this.currentChannelId = channelId;
  }

  logout(): void {
    this.authenticationService.logout();
  }

  showAddUserForm(): void {
    this.showAddUserModal = true;
  }
}

