import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { GroupService } from 'src/app/services/group.service';

@Component({
  standalone: true,
  selector: 'app-group',
  templateUrl: './group.component.html',
  styles: [
  ],
  imports: [NgFor, CommonModule]
})
export class GroupComponent {
  groups: any[] = [];

  constructor(private groupService: GroupService) { }
  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
    // Replace this with the actual user ID from the session or a service
    if (userId) {
      this.groupService.getGroupsByUserId(userId).subscribe({
        next: (groups) => {
          this.groups = groups;
        }, error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
