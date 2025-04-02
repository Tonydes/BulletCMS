import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from 'src/app/core/auth/service/auth.service';
import { Credentials } from 'src/app/core/auth/models/user.model';
import { ExternalColorConfigurator } from 'src/app/shared/external-color-configurator/external-color-configurator.component';

@Component({
  selector: 'bcms-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    CheckboxModule,
    RippleModule,
    ExternalColorConfigurator
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  returnUrl: string;

  constructor() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/bcms-admin';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: Credentials = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Login effettuato', detail: 'Accesso eseguito con successo!' });
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (err: HttpErrorResponse) => {
          let errorMessage = 'Errore durante il login. Riprova.';
          if (err.status === 400 || err.status === 401 || err.status === 422) {
            errorMessage = 'Credenziali non valide.';
          }
          this.messageService.add({ severity: 'error', summary: 'Errore di Login', detail: errorMessage, life: 5000 });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}
