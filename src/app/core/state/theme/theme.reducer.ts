import { createReducer, on } from '@ngrx/store';
import * as ThemeActions from './theme.actions';
import { initialThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,

  // Gestione azioni UI/Set
  on(ThemeActions.setThemePreferences, (state, { preferences }) => ({
    ...state,
    ...preferences,
    isInitialized: true
  })),

  on(ThemeActions.toggleDarkMode, (state) => ({
    ...state,
    darkTheme: !state.darkTheme,
    isInitialized: true
  })),

  on(ThemeActions.setPrimaryColor, (state, { color }) => ({
    ...state,
    primaryColor: color,
    isInitialized: true
  })),

  on(ThemeActions.setSurfaceColor, (state, { color }) => ({
    ...state,
    surfaceColor: color,
    isInitialized: true
  })),

  // Gestione stati Loading/Error per il caricamento
  on(ThemeActions.loadThemePreferences, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ThemeActions.loadThemePreferencesSuccess, (state, { preferences }) => ({
    ...state,
    ...preferences, // Applica le preferenze caricate
    loading: false,
    error: null,
    isInitialized: true
  })),
  on(ThemeActions.loadThemePreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Gestione stati Loading/Error per il salvataggio
  on(ThemeActions.saveThemePreferences, (state) => ({
    ...state,
    loading: true, // Indica che stiamo salvando
    error: null
  })),
  on(ThemeActions.saveThemePreferencesSuccess, (state) => ({
    ...state,
    loading: false // Salvataggio completato
  })),
  on(ThemeActions.saveThemePreferencesFailure, (state, { error }) => ({
    ...state,
    loading: false, // Salvataggio fallito
    error
  })),
  // Reset Inizializzazione
  on(ThemeActions.resetThemeInitialization, (state) => ({
    ...state,
    isInitialized: false
    // Qui potresti anche resettare le preferenze ai valori di default se necessario
    // darkTheme: initialThemeState.darkTheme,
    // primaryColor: initialThemeState.primaryColor,
    // surfaceColor: initialThemeState.surfaceColor,
  }))
);
