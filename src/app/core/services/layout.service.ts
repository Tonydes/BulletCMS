// src/app/core/services/layout.service.ts
import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Definisce lo stato relativo alla visualizzazione e interazione
 * dei componenti strutturali del layout (es. sidebar, overlay).
 */
interface LayoutState {
  staticMenuDesktopInactive: boolean; // Menu statico chiuso su desktop
  overlayMenuActive: boolean; // Menu overlay (o mobile) visibile
  // configSidebarVisible: boolean;   // Mantenere solo se esiste una config sidebar *separata* dal tema
  staticMenuMobileActive: boolean; // Menu statico attivo su mobile (potrebbe coincidere con overlayMenuActive)
  menuHoverActive: boolean; // Se il menu ha uno stato hover (per menu statico desktop)
}

/**
 * Definisce l'evento emesso quando lo stato di un elemento del menu cambia
 * (usato per sincronizzare lo stato attivo e le animazioni).
 */
interface MenuChangeEvent {
  key: string; // Identificatore univoco dell'elemento del menu
  routeEvent?: boolean; // Indica se l'evento è triggerato dalla navigazione
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // --- Stato Interno del Layout ---
  private _initialLayoutState: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    // configSidebarVisible: false, // Rimuovere se non usata
    staticMenuMobileActive: false,
    menuHoverActive: false
  };
  /** Signal che contiene lo stato corrente del layout strutturale. */
  layoutState = signal<LayoutState>(this._initialLayoutState);

  // --- Subjects per la Comunicazione Interna ---
  /** Emette un evento quando un menu overlay (o mobile) viene aperto. */
  private overlayOpen = new Subject<void>();
  /** Emette un evento quando lo stato di un menu item cambia (click, route change). */
  private menuSource = new Subject<MenuChangeEvent>();
  /** Emette un evento per richiedere il reset dello stato attivo del menu. */
  private resetSource = new Subject<void>();

  /** Observable per ascoltare l'apertura del menu overlay. */
  overlayOpen$ = this.overlayOpen.asObservable();
  /** Observable per ascoltare i cambiamenti di stato dei menu items. */
  menuSource$ = this.menuSource.asObservable();
  /** Observable per ascoltare la richiesta di reset del menu. */
  resetSource$ = this.resetSource.asObservable();

  constructor() {
    // Il costruttore è ora pulito dalla logica del tema
  }

  // --- Metodi Pubblici per Interagire con il Layout ---

  /**
   * Gestisce il click sul pulsante di toggle del menu principale.
   * Aggiorna lo stato del layout (desktop/mobile) e notifica l'apertura dell'overlay.
   */
  onMenuToggle() {
    if (this.isDesktop()) {
      // Toggle dello stato inattivo per menu statico su desktop
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !prev.staticMenuDesktopInactive
      }));
    } else {
      // Toggle dello stato attivo per menu overlay/mobile
      const isActive = !this.layoutState().overlayMenuActive; // Basato su overlay, potrebbe cambiare
      this.layoutState.update((prev) => ({
        ...prev,
        overlayMenuActive: isActive,
        staticMenuMobileActive: isActive // Assumiamo siano collegati, altrimenti logica separata
      }));

      // Se il menu mobile/overlay viene attivato, emetti l'evento e blocca lo scroll
      if (isActive) {
        this.overlayOpen.next();
        this.blockBodyScroll(); // Blocca lo scroll del body
      } else {
        this.unblockBodyScroll(); // Sblocca lo scroll del body
      }
    }
  }

  /**
   * Notifica un cambiamento nello stato di un menu item.
   * Usato da `menu-item.component` per gestire lo stato attivo.
   * @param event L'evento con la chiave del menu item.
   */
  onMenuStateChange(event: MenuChangeEvent) {
    this.menuSource.next(event);
  }

  /**
   * Richiede il reset dello stato 'attivo' di tutti i menu items.
   * Usato da `menu-item.component`.
   */
  resetMenu() {
    this.resetSource.next();
  }

  /**
   * Chiude il menu mobile/overlay. Utile quando si naviga.
   * Mantiene lo stato desktop invariato.
   */
  hideMobileMenu() {
    this.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false
    }));
    this.unblockBodyScroll(); // Assicurati di sbloccare lo scroll
  }

  // --- Metodi Helper ---

  /** Controlla se la larghezza attuale della finestra corrisponde a desktop (> 991px). */
  isDesktop(): boolean {
    return window.innerWidth > 991;
  }

  /** Controlla se la larghezza attuale della finestra corrisponde a mobile (<= 991px). */
  isMobile(): boolean {
    return window.innerWidth <= 991;
  }

  /** Aggiunge una classe al body per prevenire lo scroll. */
  private blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  /** Rimuove la classe dal body per riabilitare lo scroll. */
  private unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }
}
