import { Injectable, signal, computed, inject, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Credentials, RegisterData, User } from '../models/user.model';
import { AuthResponse } from '../models/auth-response.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';

  private http = inject(HttpClient);
  private jwtHelper = new JwtHelperService();

  private _user = signal<User | null>(null);
  private _accessToken = signal<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  isAuthenticated = computed(() => !!this._accessToken());
  currentUser = computed(() => this._user());
  getAccessToken = computed(() => this._accessToken());

  constructor(private storageService: StorageService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = this.storageService.getItem('accessToken');
    const refreshToken = this.storageService.getItem('refreshToken');
    const user = this.storageService.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        if (!this.jwtHelper.isTokenExpired(token)) {
          this._accessToken.set(token);
          this._user.set(parsedUser);
          if (refreshToken) {
            this.refreshTokenSubject.next(refreshToken);
          }
        } else {
          this.refreshToken().subscribe();
        }
      } catch (error) {
        console.error("Errore nel parsing dell'utente:", error);
        this.clearStorage();
      }
    }
  }

  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => this.setSession(response)),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap((response) => this.setSession(response)),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearStorage();
    this._user.set(null);
    this._accessToken.set(null);
    this.refreshTokenSubject.next(null);
  }

  refreshToken(): Observable<AuthResponse | null> {
    const refreshToken = this.refreshTokenSubject.getValue();
    if (!refreshToken) {
      this.logout();
      return of(null);
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, { refreshToken }).pipe(
      tap((response) => this.setSession(response)),
      catchError((error) => {
        console.error('Errore durante il refresh del token:', error);
        this.logout();
        return of(null);
      })
    );
  }

  private setSession(authResult: AuthResponse): void {
    this._accessToken.set(authResult.accessToken);
    this._user.set(authResult.user);
    this.refreshTokenSubject.next(authResult.refreshToken);

    this.storageService.setItem('accessToken', authResult.accessToken);
    this.storageService.setItem('refreshToken', authResult.refreshToken);
    this.storageService.setItem('user', JSON.stringify(authResult.user));
  }

  private clearStorage(): void {
    this.storageService.removeItem('accessToken');
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('user');
  }
  // Helper functions
  getCurrentUser(): User | null {
    return this._user();
  }
  getToken(): string | null {
    return this._accessToken();
  }
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Errore di rete:', error.error);
    } else if (error.status === 400) {
      console.error('Richiesta non valida:', error.error);
    } else if (error.status === 401) {
      console.error('Non autenticato:', error.error);
    } else if (error.status === 403) {
      console.error('Non autorizzato:', error.error);
    } else if (error.status === 404) {
      console.error('Risorsa non trovata:', error.error);
    } else if (error.status === 422) {
      console.error('Dati non validi:', error.error);
    } else if (error.status >= 500) {
      console.error('Errore del server:', error.error);
    } else {
      console.error('Errore HTTP generico:', error);
    }

    return throwError(() => error);
  }
}
