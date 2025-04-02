import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from './theme.state';

// Nome della feature come definito in provideStore
export const THEME_FEATURE_KEY = 'theme';

export const selectThemeState = createFeatureSelector<ThemeState>(THEME_FEATURE_KEY);

export const selectIsDarkTheme = createSelector(selectThemeState, (state) => state.darkTheme);

export const selectPrimaryColor = createSelector(selectThemeState, (state) => state.primaryColor);

export const selectSurfaceColor = createSelector(selectThemeState, (state) => state.surfaceColor);

// Selettore utile per ottenere le preferenze da salvare/applicare
export const selectCurrentThemePreferences = createSelector(selectThemeState, (state) => ({
  darkTheme: state.darkTheme,
  primaryColor: state.primaryColor,
  surfaceColor: state.surfaceColor
}));

export const selectThemeLoading = createSelector(selectThemeState, (state) => state.loading);

export const selectThemeError = createSelector(selectThemeState, (state) => state.error);
