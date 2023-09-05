import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ],
  imports: [ ReactiveFormsModule, NgIf, CommonModule ]
})
export class RegisterComponent {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.authenticationService.register(user).subscribe({
        next: (response) => {
          // Navigate to the dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // Handle the error from the server
          console.log(error);
        }
      });
    }
  }

}
