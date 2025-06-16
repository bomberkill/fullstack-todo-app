import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Notification as NotificationService } from '../../services/notification';
import { Auth } from '../../services/auth';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: Auth,
    private router: Router

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onLoginSubmit(): void {
    // console.log("start submit")
    // console.log('Form values:', this.loginForm.value);
    if (this.loginForm.invalid) {
      // this.notificationService.show('Please fill in all required fields correctly.', 'error');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.notificationService.show('Login successful!', 'success');
        // console.log('Login successful, token:', response.token);
        this.router.navigate(['/tasks']);
        this.loginForm.reset();
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.message || 'Login failed. Please try again.';
        this.notificationService.show(errorMessage, 'error');
        console.error('Login error:', err);
      }
    });
  }


}
