export function initializeAppTheme(): () => void {
  return () => {
    console.log('APP_INITIALIZER: Eseguo inizializzazione tema...');
    const storageKey = 'themePreferences'; // Usa la stessa chiave del ThemeBackendService Fake
    let isDarkMode = false; // Default a tema chiaro

    try {
      const storedPrefsString = localStorage.getItem(storageKey);
      if (storedPrefsString) {
        const storedPrefs = JSON.parse(storedPrefsString);
        // Controlla esplicitamente se la proprietà darkTheme è un booleano
        if (typeof storedPrefs.darkTheme === 'boolean') {
          isDarkMode = storedPrefs.darkTheme;
        }
      }
      console.log(`APP_INITIALIZER: Applico dark mode iniziale? ${isDarkMode}`);
      // Applica o rimuovi la classe PRIMA che l'app Angular si renderizzi completamente
      if (isDarkMode) {
        document.documentElement.classList.add('app-dark');
      } else {
        // È importante rimuoverla se non è dark, per evitare che rimanga da una sessione precedente
        document.documentElement.classList.remove('app-dark');
      }
    } catch (e) {
      console.error("APP_INITIALIZER: Errore durante l'inizializzazione del tema da localStorage", e);
      // Fallback sicuro: rimuovi la classe dark
      document.documentElement.classList.remove('app-dark');
    }
  };
}
