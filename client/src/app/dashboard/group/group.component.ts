import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/models/group.model';
import { FormsModule } from '@angular/forms';
import { ChannelService } from 'src/app/services/channel.service';
import { Channel } from 'src/app/models/channel.model';
import { ChannelComponent } from '../channel/channel.component';

@Component({
  standalone: true,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [],
  imports: [NgFor, CommonModule, FormsModule, ChannelComponent],
})
export class GroupComponent {
  user: any = {};
  groups: any[] = [];
  editingGroupId: number | null = null;
  isSuper: Boolean = false;
  canEditGroup: { [groupId: number]: boolean } = {};
  groupChannels: { [groupId: number]: Channel[] } = {};

  constructor(
    private groupService: GroupService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   * Lifecycle hook that runs when the component is initialized
   */
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.user) {
      this.getGroups();
    }
  }

  checkCanEdit(group: Group) {
    this.groupService.getUserRole(group.id, this.user.id).subscribe({
      next: (role) => {
        console.log(role);
        console.log(this.user.isSuper);
        this.canEditGroup[group.id] = role || this.user.isSuper;
        console.log(this.canEditGroup[group.id]);
      },
      error: (err) => {
        console.log(err);
        this.canEditGroup[group.id] = false;
      },
    });
  }

  canEdit(group: Group): boolean {
    return this.canEditGroup[group.id] || false;
  }

  /**
   * Function to get all groups for the user
   * @returns
   */
  getGroups(): void {
    this.groupService.getGroupsByUserId(this.user.id).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.groups.forEach((group) => {
          this.checkCanEdit(group);
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Function to add a new group
   * @param groupId
   */
  editingGroup(groupId: number): void {
    // Set the editingGroupId to the ID of the group being edited
    this.editingGroupId = groupId;
  }

  /**
   * Function to save a group
   * @param group
   */
  saveGroup(group: Group): void {
    // Update the group name and set the editing flag to false
    this.groupService.updateGroup(group).subscribe((updatedGroup) => {
      group.groupName = updatedGroup.groupName;
      this.editingGroupId = null;
    });
  }

  /**
   * Function to delete a group
   * @param id
   */
  deleteGroup(id: number): void {
    // Delete the group using the GroupService
    this.groupService.deleteGroup(id).subscribe({
      next: () => {
        // Remove the group from the array
        this.groups = this.groups.filter((g) => g.id !== id);
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
    group.showChannels = !group.showChannels;
  }
}
