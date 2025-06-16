import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../services/auth';
import { Notification as  NotificationService } from '../../services/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  onRegisterSubmit(): void {
    // console.log("start submit")
    // console.log('Form values:', this.registerForm.value);
    if (this.registerForm.invalid) {
      // this.notificationService.show('Please fill in all fields correctly.', 'error', 5000, 'Validation Error');
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.notificationService.show('Registration successful! You are now logged in.', 'success', 5000, 'Success!');
        // console.log('Registration successful, token:', response.token);
        this.registerForm.reset();
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Registration failed. Please try again.';
        this.notificationService.show(errorMessage, 'error', 5000, 'Registration Error');
        console.error('Registration error:', err);
      }
    });

  }
}
