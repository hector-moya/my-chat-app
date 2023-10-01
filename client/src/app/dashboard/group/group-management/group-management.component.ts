import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from 'src/app/modal/modal.component';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './group-management.component.html',
  styles: [
  ]
})
export class GroupManagementComponent {

  @Input() currentGroupId!: string | undefined;
  groupUsers: { user: User, roleName: string }[] = [];
  emailInput: string = '';
  userExists: boolean = false;
  showModal: boolean = false;
  roleName: string = '';

  private userService = inject(UserService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  public notificationService = inject(NotificationService);

  /**
   * Function to show the group users modal
   * @param groupId
   * @returns
   * @memberof GroupComponent
   */
  loadGroupUsers(): void {
    this.groupUsers = []; // Clear the array first
    this.userService.getUsersByGroupId(this.currentGroupId).subscribe({
        next: (users) => {
            users.forEach(user => {
                this.userService.getUserRole(this.currentGroupId, user._id).subscribe({
                    next: (role) => {
                        const userObj = { user: user, roleName: role.roleName };
                        this.groupUsers.push(userObj);
                        this.changeDetectorRef.detectChanges();
                    }
                });
            });
            this.showModal = true;
        },
        error: (err) => {
            console.error(err);
        }
    });
}

  


  /**
   * Function to close the group users modal
   */
  closeGroupUsersModal(): void {
    this.showModal = false;
  }

  /**
   * Function to check if a user exists
   */
  checkUserExistence(): void {
    if (this.emailInput) {
      this.userService.getUserByEmail(this.emailInput).subscribe({
        next: (user) => {
          if (user) {
            this.userExists = true;
            this.notificationService.notify('User exists and can be added to the group.');
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

  /**
   * Function to add a user to a group
   */
  addUserToGroup(): void {
    if (this.userExists && this.currentGroupId) {
      this.userService.addUserToGroup(this.emailInput, this.currentGroupId).subscribe({
        next: (user) => {
          this.notificationService.notify('User added to the group successfully.');
          this.groupUsers.push({ user: user, roleName: 'user' }); // Add the user to the groupUsers array to update the view
          this.emailInput = ''; // Clear the email input

        },
        error: (err) => {
          console.error(err);
          this.notificationService.notify('Failed to add user to the group.');
        }
      });
    }
  }

  /**
   * Function to remove a user from a group
   * @param userId
   */
  removeUserFromGroup(userId: string): void {
    if (this.currentGroupId) {
      this.userService.removeUserFromGroup(userId, this.currentGroupId).subscribe({
        next: () => {
          this.notificationService.notify('User removed from the group successfully.');
          this.groupUsers = this.groupUsers.filter((userObj) => userObj.user._id !== userId);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.notificationService.notify('Failed to remove user from the group.');
        }
      });
    }
  }

  updateRole(user: User, roleName: string): void {
    this.userService.updateUserRoleInGroup(user._id, this.currentGroupId, roleName).subscribe({
      next: () => {
        this.notificationService.notify('User role updated successfully.');
        // Update the roleName in the groupUsers array
        const userObj = this.groupUsers.find(u => u.user._id === user._id);
        if (userObj) {
          userObj.roleName = roleName;
        }
      },
      error: (err) => {
        console.error(err);
        this.notificationService.notify('Failed to update user role.');
      }
    });
  }
}
