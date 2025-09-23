import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@techstore.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

       this.router.navigate(['/productos']);

      /*
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/solicitudes']);
          } else {
            this.errorMessage = response.message;
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error en el servidor. Intente nuevamente.';
          this.loading = false;
          console.error('Login error:', error);
        }
      });
      */
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


}
