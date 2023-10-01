import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styles: [
  ]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  showModal: boolean = false;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  updateRole(user: User): void {
    // Call UserService method to update the user's role
    this.userService.updateUserRole(user._id, user.isSuper).subscribe({
      next: (response) => {
        // Update the user in the list of users
        this.users = this.users.map((u) => {
          if (u._id === response.user._id) {
            return response.user;
          }
          return u;
        });
      },
      error: (err) => {
        console.error("Failed to update user role:", err);
        // Revert the dropdown change in case of error
        user.isSuper = !user.isSuper;
      }
    });
  }


}
