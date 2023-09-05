import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';
import { Group, UserGroup } from 'src/app/models/group.model';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [],
  imports: [NgFor, CommonModule, FormsModule],
})
export class GroupComponent {
  groups: any[] = [];
  editingGroupId: number | null = null;
  isSuper: Boolean = false;

  constructor(
    private groupService: GroupService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
      this.groupService.getGroupsByUserId(user.id).subscribe({
        next: (groups) => {
          this.groups = groups;
          // Call the getUserRole function for each group to get the user's role
          this.groups.forEach((group) => {
            this.groupService.getUserRole(group.id, user.id).subscribe({
              next: (role) => {
                group.userRole = role;
                this.isSuper = user.isSuper;
              },
              error: (err) => {
                console.log(err);
              },
            });
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  editingGroup(groupId: number): void {
    // Set the editingGroupId to the ID of the group being edited
    this.editingGroupId = groupId;
  }

  saveGroup(group: Group): void {
    // Update the group name and set the editing flag to false
    this.groupService.updateGroup(group).subscribe((updatedGroup) => {
      group.groupName = updatedGroup.groupName;
      this.editingGroupId = null;
    });
  }

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

  showChannels(group: any): void {
    // Toggle the showChannels property
    group.showChannels = !group.showChannels;
  }
}
