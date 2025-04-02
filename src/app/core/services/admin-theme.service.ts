// src/app/core/services/theme-backend.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs'; // Importa 'of' e 'timer'
import { delay, map, catchError, tap } from 'rxjs/operators';
// Importa solo le parti dello stato che devono essere salvate/caricate
import { ThemeState } from '../state/theme/theme.state'; // Assicurati che il percorso sia corretto

// Definisci un tipo per le preferenze effettivamente salvate
type StoredThemePreferences = Pick<ThemeState, 'darkTheme' | 'primaryColor' | 'surfaceColor'>;

@Injectable({
  providedIn: 'root' // Rende il servizio disponibile globalmente
})
export class AdminThemeService {
  private storageKey = 'themePreferences'; // Chiave per localStorage
  private simulationDelay = 300; // Ritardo simulato in millisecondi

  constructor() {
    console.log('ThemeBackendService (Fake using localStorage) initialized.');
  }

  /**
   * Simula il caricamento delle preferenze dal backend leggendo da localStorage.
   * @returns Observable con le preferenze caricate o quelle di default.
   */
  loadPreferences(): Observable<StoredThemePreferences> {
    console.log(`[Fake Backend] Attempting to load preferences from key: ${this.storageKey}`);

    // Simula chiamata asincrona
    return timer(this.simulationDelay).pipe(
      map(() => {
        const storedData = localStorage.getItem(this.storageKey);
        const defaultPreferences: StoredThemePreferences = {
          darkTheme: false,
          primaryColor: 'emerald', // Assicurati che sia il tuo default desiderato
          surfaceColor: null
        };

        if (storedData) {
          try {
            // Prova a fare il parsing e unisci con i default per assicurarti che tutte le chiavi esistano
            const parsedPrefs = JSON.parse(storedData);
            const loadedPreferences = { ...defaultPreferences, ...parsedPrefs };
            console.log('[Fake Backend] Preferences loaded from localStorage:', loadedPreferences);
            return loadedPreferences;
          } catch (error) {
            console.error('[Fake Backend] Error parsing stored preferences, returning defaults.', error);
            localStorage.removeItem(this.storageKey); // Rimuovi dati corrotti
            return defaultPreferences;
          }
        } else {
          console.log('[Fake Backend] No preferences found in localStorage, returning defaults.');
          return defaultPreferences;
        }
      })
      // Simula un possibile errore di rete (raro con localStorage ma utile per testare il flusso di errore)
      // catchError(err => {
      //   console.error('[Fake Backend] Simulated network error during load:', err);
      //   throw new Error('Simulated backend load error'); // Lancia un errore che l'effetto può catturare
      // })
    );
  }

  /**
   * Simula il salvataggio delle preferenze sul backend scrivendo in localStorage.
   * @param preferences Le preferenze da salvare (solo le parti rilevanti).
   * @returns Observable che simula la risposta del backend (es. successo).
   */
  savePreferences(preferences: StoredThemePreferences): Observable<any> {
    console.log('[Fake Backend] Attempting to save preferences:', preferences);

    // Simula chiamata asincrona
    return timer(this.simulationDelay).pipe(
      map(() => {
        try {
          // Salva solo le chiavi rilevanti, non l'intero stato NgRx (loading, error, isInitialized)
          const dataToStore: StoredThemePreferences = {
            darkTheme: preferences.darkTheme,
            primaryColor: preferences.primaryColor,
            surfaceColor: preferences.surfaceColor
          };
          localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
          console.log('[Fake Backend] Preferences saved to localStorage.');
          return { success: true, message: 'Preferences saved successfully.' }; // Simula risposta OK
        } catch (error) {
          console.error('[Fake Backend] Error saving preferences to localStorage:', error);
          // Lancia un errore che l'effetto può catturare
          throw new Error('Simulated backend save error');
        }
      })
      // catchError(err => {
      //   console.error('[Fake Backend] Caught error during save operation:', err);
      // Restituisce un Observable di errore che l'effetto può gestire
      //   return of({ success: false, message: err.message });
      // })
    );
  }
}
