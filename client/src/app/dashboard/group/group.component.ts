import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/group.model';
import { FormsModule } from '@angular/forms';
import { Channel } from 'src/app/models/channel.model';
import { ChannelComponent } from '../channel/channel.component';
import { PermissionService } from 'src/app/services/permission.service';
import { User } from 'src/app/models/user.model';
import { ModalComponent } from 'src/app/modal/modal.component';
import { NotificationService } from 'src/app/services/notification.service';
import { GroupManagementComponent } from './group-management/group-management.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  standalone: true,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [],
  imports: [NgFor, CommonModule, FormsModule, ChannelComponent, ModalComponent, GroupManagementComponent],
})
export class GroupComponent {
  user: any = {};
  groups: any[] = [];
  groupUsers: User[] = [];
  editingGroupId: string | null = null;
  isSuper: Boolean = false;
  groupChannels: { [groupId: string]: Channel[] } = {};
  showAddGroupModal: boolean = false;
  newGroupName: string = '';
  showGroupUsersModal: boolean = false;
  emailInput: string = '';
  userExists: boolean = false;
  currentGroupId: string | null = null;

  private groupService = inject(GroupService);
  private permissionService = inject(PermissionService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  public notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.user) {
      if (this.user.isSuper) {
        this.getAllGroups();
      } else {
        this.getGroups();
      }
    }
  }

  /**
   * Function to check if the user can edit a group
   * @param group 
   */
  checkCanEdit(group: Group) {
    if (group._id) {
      this.groupService.getUserRole(group._id, this.user._id).subscribe({
        next: (role) => {
          console.log('Role:', role);
          const canEdit = role || this.user.isSuper;
          this.permissionService.updateCanEditGroup(group._id!, canEdit);
        },
        error: (err) => {
          if (group._id) {
            this.permissionService.updateCanEditGroup(group._id, false);
          }
        }
      });
    }
  }

  /**
   * Function to check if the user can edit a group
   * @param group
   * @returns
   */
  canEdit(group: Group): boolean {
    return group._id ? this.permissionService.canEditGroup[group._id] || false : false;
  }

  /**
   * Function to get all groups for the user
   * @returns
   */
  getGroups(): void {
    console.log('Getting groups for user:', this.user._id);
    this.groupService.getGroupsByUserId(this.user._id).subscribe({
      next: (groups) => {
        this.groups = groups;
  
        // Fetch role and update permissions for each group
        this.groups.forEach((group) => {
          if (group._id) {
            this.userService.getUserRole(group._id, this.user._id).subscribe({
              next: (role) => {
                const canEdit = role.roleName === 'admin';
                this.permissionService.updateCanEditGroup(group._id, canEdit);
              },
              error: (err) => {
                console.error(`Error fetching role for group ${group._id}:`, err);
                this.permissionService.updateCanEditGroup(group._id, false);
              }
            });
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  

  /**
   * Function to add a new group
   * @param groupId
   */
  editingGroup(groupId: string): void {
    // Set the editingGroupId to the ID of the group being edited
    console.log('Editing group:', groupId);
    this.editingGroupId = groupId;
  }

  /**
   * Function to save a group
   * @param group
   */
  saveGroup(group: Group): void {
    if (group._id) {
      this.groupService.updateGroup(group).subscribe((updatedGroup) => {
        group.groupName = updatedGroup.groupName;
        this.editingGroupId = null;
      });
    }
  }

  /**
   * Function to delete a group
   * @param id
   */
  deleteGroup(_id: string): void {
    // Delete the group using the GroupService
    this.groupService.deleteGroup(_id).subscribe({
      next: () => {
        // Remove the group from the array
        this.groups = this.groups.filter((g) => g._id !== _id);
        // Trigger change detection
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Error deleting group:', error);
      },
    });
  }


  /**
   * Function to show the channels for a group
   * @param group
   */
  showChannels(group: any): void {
    // Toggle the showChannels property
    if (!this.editingGroupId) {
      group.showChannels = !group.showChannels;
    }
  }

  /**
   * Function to get all groups
   * This is only used for superusers
   * @returns
   */
  getAllGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        // You can decide whether a superuser can edit all groups or not
        this.groups.forEach((group) => {
          this.permissionService.updateCanEditGroup(group._id, true);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Function to show the add group modal
  showModal(): void {
    console.log('Showing add group form');
    this.showAddGroupModal = true;
  }

  // Function to add a new group
  addNewGroup(): void {
    if (this.newGroupName) {
      const newGroup: Group = { groupName: this.newGroupName }; // id will be generated by the server
      this.groupService.addGroup(newGroup, this.user._id).subscribe({
        next: (group) => {
          this.groups.push(group); // Update the local groups array

          // If the user is a super user, directly update the permissions
          if (this.user.isSuper && group._id) {
            this.permissionService.updateCanEditGroup(group._id, true);
          } else {
            this.checkCanEdit(group);
          }

          this.showAddGroupModal = false; // Hide the modal
          this.newGroupName = ''; // Clear the input

          // Run change detection manually
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.log('Error adding new group:', error);
        }
      });
    }
  } 

}
