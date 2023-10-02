import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ModalComponent } from 'src/app/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-management',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './channel-management.component.html',
  styles: [
  ]
})
export class ChannelManagementComponent implements OnInit{
  @Input() currentChannelId!: string | undefined;
  @Input() currentGroupId!: string | undefined;
  channelUsers: any[] = [];
  groupUsers: any[] = [];
  emailInput: string = '';
  userExists: boolean = false;
  showModal: boolean = false;
  selectedUser: string = '';

  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  public notificationService = inject(NotificationService);

  ngOnInit(): void { 
  }

  
  // Load the users of a channel
  loadChannelUsers(): void {
    this.loadGroupUsers();
    this.userService.getUsersByChannelId(this.currentChannelId).subscribe({
      next: (users) => {
        this.channelUsers = users;
        this.showModal = true;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadGroupUsers(): void {
    this.userService.getUsersByGroupId(this.currentGroupId).subscribe({
      next: (users) => {
        this.groupUsers = users;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  

  // Check if a user exists by email
  checkUserExistence(): void {
    if (this.emailInput) {
      this.userService.getUserByEmail(this.emailInput).subscribe({
        next: (user) => {
          if (user) {
            this.userExists = true;
            this.notificationService.notify('User exists and can be added to the channel.');
          } else {
            this.userExists = false;
            this.notificationService.notify('User does not exist.');
          }
        },
        error: (err) => {
          console.error(err);
          this.notificationService.notify('An error occurred. Please try again.');
        }
      });
    } else {
      this.notificationService.notify('');
    }
  }

  // Add a user to a channel
  addUserToChannel(): void {
    if (this.selectedUser && this.currentChannelId) {
      this.userService.addUserToChannel(this.selectedUser, this.currentChannelId).subscribe({
        next: (user) => {
          this.notificationService.notify('User added to the channel successfully.');
          this.channelUsers.push(user);
          this.selectedUser = '';
        },
        error: (err) => {
          console.error(err);
          this.notificationService.notify('Failed to add user to the channel.');
        }
      });
    }
  }

  // Remove a user from a channel
  removeUserFromChannel(userId: string): void {
    if (this.currentChannelId) {
      this.userService.removeUserFromChannel(userId, this.currentChannelId).subscribe({
        next: () => {
          this.notificationService.notify('User removed from the channel successfully.');
          this.channelUsers = this.channelUsers.filter((user) => user._id !== userId);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.notificationService.notify('Failed to remove user from the channel.');
        }
      });
    }
  }

}
