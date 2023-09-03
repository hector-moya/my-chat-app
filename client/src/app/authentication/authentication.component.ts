import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


@Component({
  standalone: true,
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  imports: [ LoginComponent, RegisterComponent, NgIf, CommonModule, HttpClientModule ],
  styles: [
  ]
})
export class AuthenticationComponent {
  // This property will be used to determine which form to show.
  show: 'login' | 'register' | null = null;

  /**
   * This method is called when the user clicks the "Login" button.
   */
  showLogin() {
    this.show = 'login';
  }

  /**
   * This method is called when the user clicks the "Register" button.
   */
  showRegister() {
    this.show = 'register';
  }

}
