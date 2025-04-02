// src/app/layout/layout.component.ts
import { Component, Renderer2, ViewChild, OnDestroy, inject } from '@angular/core'; // Aggiungi inject
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutService } from '../core/services/layout.service'; // Servizio aggiornato

@Component({
  selector: 'bcms-layout',
  standalone: true,
  imports: [CommonModule, TopbarComponent, SidebarComponent, RouterModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'] // Assumi CSS esistente
})
export class LayoutComponent implements OnDestroy {
  // Implementa OnDestroy
  private layoutService = inject(LayoutService); // Inietta il servizio aggiornato
  private renderer = inject(Renderer2);
  private router = inject(Router);

  overlayMenuOpenSubscription: Subscription;
  routerSubscription: Subscription; // Per gestire la sottoscrizione al router

  menuOutsideClickListener: (() => void) | null = null; // Tipo funzione che non ritorna nulla

  @ViewChild(SidebarComponent) bcmsSidebar!: SidebarComponent;
  @ViewChild(TopbarComponent) bcmsTopBar!: TopbarComponent; // Mantieni se serve referenziarlo

  constructor() {
    // Sottoscrizione per gestire click esterni e chiusura menu
    this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
      // Se il listener non esiste già, crealo
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
          // Usa il metodo isOutsideClicked aggiornato se necessario
          if (this.isOutsideClicked(event)) {
            this.hideMenu();
          }
        });
      }
    });

    // Sottoscrizione per chiudere il menu su navigazione
    this.routerSubscription = this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Assicura tipo corretto
      )
      .subscribe(() => {
        this.hideMenu(); // Chiama il metodo per chiudere il menu mobile/overlay
      });
  }

  /**
   * Controlla se il click è avvenuto fuori dalla sidebar e dal bottone toggle.
   * @param event Evento del mouse.
   * @returns True se il click è esterno, false altrimenti.
   */
  isOutsideClicked(event: MouseEvent): boolean {
    const sidebarEl = document.querySelector('.layout-sidebar'); // Selettore della sidebar
    const topbarEl = document.querySelector('.layout-menu-button'); // Selettore del bottone toggle
    const target = event.target as Node;

    // Controlla se il target o i suoi antenati sono la sidebar o il bottone
    const isClickInsideSidebar = sidebarEl?.contains(target);
    const isClickInsideTopbarButton = topbarEl?.contains(target);

    return !(isClickInsideSidebar || isClickInsideTopbarButton);
  }

  /** Chiama il metodo del servizio per nascondere il menu mobile/overlay. */
  hideMenu() {
    this.layoutService.hideMobileMenu(); // Usa il metodo specifico del servizio

    // Rimuovi il listener per click esterni solo quando il menu è effettivamente chiuso
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener(); // Esegue la funzione di cleanup del listener
      this.menuOutsideClickListener = null;
    }
  }

  get containerClass() {
    const state = this.layoutService.layoutState();
    const isStaticMode = true;

    return {
      'layout-static': isStaticMode, // Applica la classe base per la struttura statica
      'layout-overlay': !isStaticMode, // Non verrà applicata se isStaticMode è true
      'layout-static-inactive': isStaticMode && state.staticMenuDesktopInactive, // Attiva solo in modalità statica quando il menu desktop è chiuso
      'layout-overlay-active': state.overlayMenuActive, // Attiva quando il menu overlay è visibile (tipicamente mobile)
      'layout-mobile-active': state.staticMenuMobileActive // Attiva quando il menu statico mobile è visibile
    };
  }

  // Assicurati di fare l'unsubscribe per prevenire memory leak
  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Rimuovi il listener se esiste ancora quando il componente viene distrutto
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
  }

  // Rimuovi i metodi blockBodyScroll e unblockBodyScroll da qui,
  // sono ora metodi privati (o pubblici se necessario) nel LayoutService
  // e chiamati da onMenuToggle/hideMobileMenu.
}
