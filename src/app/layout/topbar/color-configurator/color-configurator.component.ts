import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core'; // Rimosso signal se non serve più
import { FormsModule } from '@angular/forms';

// --- NgRx Imports ---
import { Store } from '@ngrx/store'; // Inietta lo Store
import * as ThemeActions from 'src/app/core/state/theme/theme.actions'; // Importa le azioni del tema (verifica percorso)
import {
  selectPrimaryColor,
  selectSurfaceColor,
  selectIsDarkTheme // Importa i selettori necessari (verifica percorso)
} from 'src/app/core/state/theme/theme.selectors';

// --- PrimeNG UI Imports (Mantenuti se usati nel template HTML) ---
import { SelectButtonModule } from 'primeng/selectbutton';

// --- Theme Utilities Imports ---
import {
  surfaces, // Array delle opzioni surface
  getPresetPrimitive, // Funzione per ottenere le palette primitive (es. di Aura)
  primaryColorNames, // Array dei nomi dei colori primari disponibili
  SurfaceType, // Definizione del tipo per gli oggetti surface
  PaletteType // Definizione del tipo per le palette
} from 'src/app/core/state/theme/theme.utils'; // Importa da utils (verifica percorso)

// --- RIMOZIONI ---
// Rimossi import non più necessari: Router, $t, updatePreset, updateSurfacePalette, Aura, PrimeNG, LayoutService

@Component({
  selector: 'bcms-color-configurator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule // Mantenuto se usato nel template
  ],
  templateUrl: './color-configurator.component.html', // Assicurati che il template esista
  styleUrls: ['./color-configurator.component.css'], // Assicurati che il CSS esista se necessario
  host: {
    // Mantenuto stile host per posizionamento/aspetto
    class:
      'hidden absolute top-[3.25rem] right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]'
  }
})
export class ColorConfiguratorComponent {
  // Inietta lo Store NgRx
  private store = inject(Store);

  // --- Dati per il Template HTML ---

  /** Lista delle opzioni surface disponibili, importata da theme.utils. */
  readonly surfacesList = surfaces;

  /**
   * Calcola dinamicamente le opzioni per i colori primari basandosi
   * sui nomi disponibili e sulle palette primitive del preset Aura.
   */
  primaryColors = computed<SurfaceType[]>(() => {
    const presetPrimitive = getPresetPrimitive('Aura'); // Ottieni palette primitive da utils
    // Inizia con il caso speciale 'noir' che non ha una palette primitiva diretta
    const palettes: SurfaceType[] = [{ name: 'noir', palette: {} }];

    // Itera sui nomi dei colori primari importati da utils
    primaryColorNames.forEach((colorName) => {
      if (colorName !== 'noir') {
        // Escludi 'noir' già aggiunto
        // Trova la palette corrispondente nel preset primitivo
        const palette = presetPrimitive?.[colorName as keyof typeof presetPrimitive];
        if (palette) {
          // Aggiungi l'opzione all'array se la palette è stata trovata
          palettes.push({
            name: colorName,
            palette: palette as PaletteType // Cast al tipo corretto
          });
        } else {
          // Logga un avviso se una palette non viene trovata (dovrebbe essere raro)
          console.warn(`ColorConfiguratorComponent: Palette non trovata per il colore primario '${colorName}' nel preset Aura.`);
        }
      }
    });
    return palettes; // Ritorna l'array completo delle opzioni primarie
  });

  // --- Lettura dello Stato dallo Store NgRx ---

  /** Signal che riflette il colore primario attualmente selezionato nello store. */
  selectedPrimaryColor = this.store.selectSignal(selectPrimaryColor);

  /** Signal che riflette il colore surface attualmente selezionato nello store. */
  selectedSurfaceColor = this.store.selectSignal(selectSurfaceColor);

  /** Signal che indica se il tema scuro è attualmente attivo nello store. */
  isDarkTheme = this.store.selectSignal(selectIsDarkTheme);

  // --- Gestione Eventi UI ---

  /**
   * Metodo chiamato quando l'utente clicca su un'opzione di colore (primario o surface).
   * Dispatcha l'azione NgRx appropriata per aggiornare lo stato.
   * L'applicazione del tema e il salvataggio sono gestiti dagli effetti NgRx.
   *
   * @param event L'evento del mouse generato dal click.
   * @param type Indica se è stato selezionato un colore 'primary' o 'surface'.
   * @param color L'oggetto SurfaceType che rappresenta il colore cliccato.
   */
  updateColors(event: MouseEvent, type: 'primary' | 'surface', color: SurfaceType): void {
    const colorName = color.name; // Estrai il nome del colore

    // Dispatcha l'azione corretta in base al tipo
    if (type === 'primary') {
      console.log(`ColorConfigurator: Dispatching SetPrimaryColor -> ${colorName}`);
      this.store.dispatch(ThemeActions.setPrimaryColor({ color: colorName }));
    } else if (type === 'surface') {
      console.log(`ColorConfigurator: Dispatching SetSurfaceColor -> ${colorName}`);
      this.store.dispatch(ThemeActions.setSurfaceColor({ color: colorName }));
    }

    // Impedisce la propagazione dell'evento (es. chiusura del popup)
    event.stopPropagation();
  }

  // --- Logica Rimossa ---
  // - ngOnInit (se conteneva solo logica tema)
  // - Metodi: applyTheme, initializePreset, getPresetExt
  // - Variabili/proprietà: router, config, primeng, presets, menuMode
  // - Iniezione di servizi non più necessari: LayoutService, PrimeNG, Router
}
