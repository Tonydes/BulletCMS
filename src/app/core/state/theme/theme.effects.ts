import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { catchError, map, tap, withLatestFrom, filter, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ThemeActions from './theme.actions';
import { selectCurrentThemePreferences, selectThemeState } from './theme.selectors';
import { $t } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { getSemanticThemeExtension, getSurfacePalette } from './theme.utils';
import { ThemeState } from './theme.state';
import { AdminThemeService } from '../../services';

@Injectable()
export class ThemeEffects implements OnInitEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private themeService = inject(AdminThemeService);

  // Carica le preferenze solo se lo stato non è già inizializzato
  loadPreferencesIfNeeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.loadThemePreferences),
      withLatestFrom(this.store.select(selectThemeState)), // Prende lo stato corrente
      // Filtra: Esegui solo se state.isInitialized è false
      filter(([action, state]: [Action, ThemeState]) => {
        console.log(`Effetto Load Preferences: Ricevuta azione ${action.type}. Stato inizializzato: ${state.isInitialized}`);
        return !state.isInitialized;
      }),
      // Se il filtro passa, procedi con la chiamata backend
      tap(() => console.log('Effetto Load Preferences: Stato non inizializzato, procedo al caricamento backend...')),
      exhaustMap(
        (
          [action, state] // Usa exhaustMap per evitare chiamate concorrenti
        ) =>
          this.themeService.loadPreferences().pipe(
            map((preferences) => {
              console.log('Effetto Load Preferences: Caricamento backend riuscito.');
              // Il reducer imposterà isInitialized = true su questa azione Success
              return ThemeActions.loadThemePreferencesSuccess({ preferences });
            }),
            catchError((error) => {
              console.error('Effetto Load Preferences: Errore caricamento backend.', error);
              // Il reducer manterrà isInitialized = false su Failure
              return of(ThemeActions.loadThemePreferencesFailure({ error }));
            })
          )
      )
    )
  );

  applyAndTriggerSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ThemeActions.toggleDarkMode,
        ThemeActions.setPrimaryColor,
        ThemeActions.setSurfaceColor,
        ThemeActions.setThemePreferences,
        ThemeActions.loadThemePreferencesSuccess
      ),
      withLatestFrom(this.store.select(selectCurrentThemePreferences)),
      tap(([action, preferences]) => {
        // Logica Applicazione Tema (come prima)
        console.log(`Applicazione tema triggerata da [${action.type}] con preferenze:`, preferences);
        if (preferences.darkTheme) {
          document.documentElement.classList.add('app-dark');
        } else {
          document.documentElement.classList.remove('app-dark');
        }
        try {
          const presetExtension = getSemanticThemeExtension(preferences.primaryColor);
          const surfacePalette = getSurfacePalette(preferences.surfaceColor);
          $t()
            .preset(Aura)
            .preset(presetExtension as any)
            .surfacePalette(surfacePalette)
            .use({ useDefaultOptions: true });
          console.log('Tema PrimeNG applicato.');
        } catch (error) {
          console.error("Errore durante l'applicazione del tema PrimeNG:", error);
        }
        if (action.type === ThemeActions.loadThemePreferencesSuccess.type) {
          const preloader = document.querySelector('.preloader');
          if (preloader) {
            console.log('Effetto Tema: Nascondo il preloader.');
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
              preloader.remove();
              console.log('Effetto Tema: Preloader rimosso dal DOM.');
            }, 600);
          }
        }
      }),
      filter(([action]) => action.type !== ThemeActions.loadThemePreferencesSuccess.type),
      map(([action, preferences]) => {
        console.log(`Triggering SavePreferences dopo azione [${action.type}].`);
        return ThemeActions.saveThemePreferences({ preferences });
      })
    )
  );

  savePreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.saveThemePreferences),
      exhaustMap(({ preferences }) =>
        this.themeService.savePreferences(preferences).pipe(
          map(() => {
            console.log('Preferenze tema salvate con successo sul backend.');
            return ThemeActions.saveThemePreferencesSuccess();
          }),
          catchError((error) => {
            console.error('Errore durante il salvataggio delle preferenze tema:', error);
            return of(ThemeActions.saveThemePreferencesFailure({ error }));
          })
        )
      )
    )
  );

  ngrxOnInitEffects(): Action {
    console.log('ThemeEffects: Inizializzazione, dispatch LoadThemePreferences.');
    return ThemeActions.loadThemePreferences();
  }
}
