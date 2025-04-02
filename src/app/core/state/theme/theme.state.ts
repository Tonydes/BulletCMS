export interface ThemeState {
  darkTheme: boolean;
  primaryColor: string;
  surfaceColor: string | null;
  loading: boolean;
  error: any | null;
  isInitialized: boolean;
}

export const initialThemeState: ThemeState = {
  darkTheme: false,
  primaryColor: 'emerald',
  surfaceColor: null,
  loading: false,
  error: null,
  isInitialized: false
};
