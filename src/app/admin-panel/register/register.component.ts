import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { passwordMatchValidator } from './password-match.validator';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/service/auth.service';
import { RegisterData } from 'src/app/core/auth/models/user.model';

@Component({
  selector: 'bcms-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  registerForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: [''],
      lastName: ['']
    },
    { validators: passwordMatchValidator }
  );

  constructor() {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterData = this.registerForm.getRawValue() as RegisterData;
      this.authService.register(registerData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Registrazione Completata', detail: 'Ora puoi effettuare il login.' });
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 400 || err.status === 422) {
            let errorMessage = 'Dati non validi. Controlla i campi.'; // Default
            if (err.error && err.error.errors) {
              errorMessage = Object.values(err.error.errors).join(' ');
            }
            this.messageService.add({ severity: 'error', summary: 'Errore di Registrazione', detail: errorMessage });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Errore', detail: 'Errore durante la registrazione. Riprova.' });
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get f() {
    return this.registerForm.controls;
  }
}
