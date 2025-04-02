import { createAction, props } from '@ngrx/store';
import { ThemeState } from './theme.state';

// Azioni per modifiche dirette (UI o caricamento iniziale)
export const setThemePreferences = createAction(
  '[Theme] Set Theme Preferences',
  props<{ preferences: Partial<Pick<ThemeState, 'darkTheme' | 'primaryColor' | 'surfaceColor'>> }>()
);

export const toggleDarkMode = createAction('[Theme] Toggle Dark Mode');

export const setPrimaryColor = createAction('[Theme] Set Primary Color', props<{ color: string }>());

export const setSurfaceColor = createAction('[Theme] Set Surface Color', props<{ color: string | null }>());

// Azioni per interazione con Backend
export const loadThemePreferences = createAction('[Theme API] Load Theme Preferences');
export const loadThemePreferencesSuccess = createAction(
  '[Theme API] Load Theme Preferences Success',
  // Carichiamo solo le preferenze, non loading/error
  props<{ preferences: Pick<ThemeState, 'darkTheme' | 'primaryColor' | 'surfaceColor'> }>()
);
export const loadThemePreferencesFailure = createAction('[Theme API] Load Theme Preferences Failure', props<{ error: any }>());

// Azione esplicita per salvare (attivata da componenti o effetti)
export const saveThemePreferences = createAction(
  '[Theme API] Save Theme Preferences',
  props<{ preferences: Pick<ThemeState, 'darkTheme' | 'primaryColor' | 'surfaceColor'> }>()
);
export const saveThemePreferencesSuccess = createAction('[Theme API] Save Theme Preferences Success');
export const saveThemePreferencesFailure = createAction('[Theme API] Save Theme Preferences Failure', props<{ error: any }>());

export const resetThemeInitialization = createAction('[Theme] Reset Initialization Status');
