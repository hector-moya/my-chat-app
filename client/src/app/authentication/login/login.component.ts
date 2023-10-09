import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { loginCredentials } from 'src/app/interfaces/user.model';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  imports: [ReactiveFormsModule, NgIf, CommonModule],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials: loginCredentials = this.loginForm.value;
      this.authenticationService.login(credentials).subscribe({
        next: (response) => {
          if (response.valid) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Invalid credentials';
          }
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred';
        },
      });
    }
  }
}
