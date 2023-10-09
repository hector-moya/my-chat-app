import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user.model';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ],
  imports: [ReactiveFormsModule, NgIf, CommonModule]
})
export class RegisterComponent {
  @Output() userRegistered = new EventEmitter<boolean>();
  @Output() registrationSuccess = new EventEmitter<boolean>(); 
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
          console.log(response);
          if (response) {
            console.log(response);
            this.userRegistered.emit(true);
            this.registrationSuccess.emit();
            // this.router.navigate(['/dashboard']);
          } else {
            // Handle the error from the server
            console.log('Error registering user');
          }
        },
        error: (error) => {
          // Handle the error from the server
          console.log(error);
        }
      });
    }
  }

}
