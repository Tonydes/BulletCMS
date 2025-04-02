import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/service/auth.service';

@Component({
  selector: 'bcms-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Email Inviata',
            detail: 'Controlla la tua casella di posta per le istruzioni per reimpostare la password.'
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          let errorMessage = 'Errore durante la richiesta di reset password.';
          if (error.status === 404) {
            errorMessage = 'Nessun utente trovato con questa email.';
          } else if (error.status === 400) {
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
          }
          this.messageService.add({ severity: 'error', summary: 'Errore', detail: errorMessage });
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }
}
