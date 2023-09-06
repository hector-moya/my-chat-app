import { Component, OnInit } from '@angular/core';
import { GroupComponent } from './group/group.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  imports: [GroupComponent, CommonModule, NgIf],
})
export class DashboardComponent implements OnInit {
  currentUser: any = null; // Store the current user information
  groups: any[] = []; // This should come from your group service.

  constructor(public authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    // Fetch the current user from session storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  logout(): void {
    this.authenticationService.logout();
  }
}

