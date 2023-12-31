import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateResponse, User } from 'src/app/interfaces/user.model';
import { ModalComponent } from 'src/app/modal/modal.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  standalone: true,
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styles: [
  ],
  imports: [FormsModule]
})
export class UserDetailsComponent implements OnInit {
  @Input() modal!: ModalComponent;
  user: User = {
    _id: '',
    userName: '',
    email: '',
    password: '',
    status: 'pending',
    imageUrl: '',
    bio: ''
  };
  password: string = '';
  confirmPassword: string = '';
  imageFile: File | null = null;
  previewImageUrl: string | ArrayBuffer | null = null;

  private userService = inject(UserService);
  private changeDetector = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      this.previewImageUrl = URL.createObjectURL(this.imageFile);
    }
  }

  onUpdate(): void {
    if (this.password === this.confirmPassword) {
      const formData = new FormData();
      formData.append('user', JSON.stringify(this.user));
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }
      this.userService.updateUser(this.user._id, formData).subscribe(response => {
        this.user = response.user;  // Update the user object with the updated data
        localStorage.setItem('currentUser', JSON.stringify(response.user));  // Update localStorage with the updated data
        this.changeDetector.detectChanges();  // Manually trigger change detection
        this.modal.onClose();  // Close the modal
      });
    } else {
      console.error('Passwords do not match');
    }
  }

}
