import { Component, OnInit } from '@angular/core';
import { GroupComponent } from './group/group.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ],
  imports: [ GroupComponent ]
})
export class DashboardComponent implements OnInit {

  currentUser: any = null; // Store the current user information
  groups: any[] = []; // This should come from your group service.

  constructor() { }

  ngOnInit(): void {
    // Fetch the current user from session storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

}

